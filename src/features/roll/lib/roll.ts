import { heroes, type HeroId } from '../../heroes/data/heroes.ts';
import {
  BALANCED_LIMITS,
  modifierById,
  modifiers,
  type Modifier,
  type ModifierId,
  type ModifierPolarity,
} from '../../modifiers/data/modifiers.ts';

/** `both` mixes at random; `balanced` keeps the good and bad counts within one of each other */
export const MODIFIER_SELECTORS = ['good', 'bad', 'both', 'balanced'] as const satisfies readonly (
  ModifierPolarity | 'both' | 'balanced'
)[];

export type ModifierSelector = (typeof MODIFIER_SELECTORS)[number];

export type CardKind = 'hero' | 'modifier';

/** Returns a number in [0, 1), like `Math.random` */
export type Random = () => number;

export interface RollSettings {
  readonly selector: ModifierSelector;
  readonly modifierCount: number;
  readonly partySize: number;
}

export interface HeroesAndModifiers {
  readonly heroIds: readonly HeroId[];
  readonly modifierIds: readonly ModifierId[];
}

export interface RollContext {
  readonly settings: RollSettings;
  readonly bans: HeroesAndModifiers;
  readonly result: HeroesAndModifiers;
  readonly locks: HeroesAndModifiers;
}

export interface RollShortfall {
  readonly heroes: number;
  readonly modifiers: number;
}

export interface GroupRoll<Id extends string> {
  readonly ids: readonly Id[];
  readonly shortfall: number;
}

export interface CountLimits {
  readonly min: number;
  readonly max: number;
}

export interface SettingsLimits {
  readonly partySize: CountLimits;
  readonly modifierCount: CountLimits;
}

export const DEFAULT_SETTINGS: RollSettings = { selector: 'both', modifierCount: 5, partySize: 1 };
export const NO_IDS: HeroesAndModifiers = { heroIds: [], modifierIds: [] };
export const NO_SHORTFALL: RollShortfall = { heroes: 0, modifiers: 0 };
export const MAX_PARTY_SIZE = 4;
/** The Custom Mode cap, checked in game (the game files do not state it) */
export const MAX_MODIFIER_COUNT = 5;

const cryptoRandom: Random = () =>
  new DataView(crypto.getRandomValues(new Uint8Array(4)).buffer).getUint32(0) / 2 ** 32;

/** Locked cards stay even when banned or off-selector: bans only affect future picks */
export function rollHeroIds(
  { settings, bans, result, locks }: RollContext,
  random: Random = cryptoRandom,
): GroupRoll<HeroId> {
  const ids = fillSlots({
    previous: result.heroIds,
    locked: locks.heroIds,
    size: settings.partySize,
    candidates: (chosen) => availableHeroes(bans, chosen),
    random,
  });

  return { ids, shortfall: Math.max(0, settings.partySize - ids.length) };
}

export function rollModifierIds(
  { settings, bans, result, locks }: RollContext,
  random: Random = cryptoRandom,
): GroupRoll<ModifierId> {
  const ids = fillSlots({
    previous: result.modifierIds,
    locked: locks.modifierIds,
    size: settings.modifierCount,
    candidates: (chosen) =>
      modifierIds(
        modifierPicks({
          selector: settings.selector,
          available: availableModifiers(settings.selector, bans, chosen),
          chosen,
          size: settings.modifierCount,
        }),
      ),
    random,
  });

  return { ids, shortfall: Math.max(0, settings.modifierCount - ids.length) };
}

export function canReplaceCard(context: RollContext, kind: CardKind, index: number): boolean {
  switch (kind) {
    case 'hero':
      return heroReplacements(context, index).length > 0;
    case 'modifier':
      return modifierReplacements(context, index).length > 0;
  }
}

export function replaceCard(
  context: RollContext,
  kind: CardKind,
  index: number,
  random: Random = cryptoRandom,
): HeroesAndModifiers | null {
  const { result } = context;

  switch (kind) {
    case 'hero': {
      const heroId = pickRandom(heroReplacements(context, index), random);

      return heroId === undefined
        ? null
        : { ...result, heroIds: replaceAt(result.heroIds, index, heroId) };
    }
    case 'modifier': {
      const modifierId = pickRandom(modifierReplacements(context, index), random);

      return modifierId === undefined
        ? null
        : { ...result, modifierIds: replaceAt(result.modifierIds, index, modifierId) };
    }
  }
}

/** One modifier cap for every selector: even the smaller polarity has more compatible modifiers */
export function settingsLimits(locks: HeroesAndModifiers): SettingsLimits {
  const lockedHeroes = locks.heroIds.length;
  const lockedModifiers = locks.modifierIds.length;

  return {
    partySize: { min: Math.max(1, lockedHeroes), max: Math.max(MAX_PARTY_SIZE, lockedHeroes) },
    modifierCount: {
      min: Math.max(1, lockedModifiers),
      max: Math.max(MAX_MODIFIER_COUNT, lockedModifiers),
    },
  };
}

export function clampSettings(settings: RollSettings, locks: HeroesAndModifiers): RollSettings {
  const limits = settingsLimits(locks);

  return {
    selector: settings.selector,
    modifierCount: clamp(settings.modifierCount, limits.modifierCount),
    partySize: clamp(settings.partySize, limits.partySize),
  };
}

export function hasCards(result: HeroesAndModifiers): boolean {
  return result.heroIds.length > 0 || result.modifierIds.length > 0;
}

/** The last hero can never be banned, so a hero roll always has a pick; expects unique IDs */
export function keepsHeroAvailable(bannedHeroIds: readonly HeroId[]): boolean {
  return bannedHeroIds.length < heroes.length;
}

/** Exclusions are listed both ways, so checking one side is enough */
export function isCompatible(modifier: Modifier, chosenIds: readonly ModifierId[]): boolean {
  return !modifier.excludes.some((excludedId) => chosenIds.includes(excludedId));
}

/** Unverified: assumes the game sums modifier scores rather than multiplying them */
export function scoreTotalPercent(modifierIds: readonly ModifierId[]): number {
  return modifiers
    .filter((modifier) => modifierIds.includes(modifier.id))
    .reduce((total, modifier) => total + modifier.scorePercent, 0);
}

function availableHeroes(bans: HeroesAndModifiers, chosen: readonly HeroId[]): HeroId[] {
  return heroes
    .filter((hero) => !bans.heroIds.includes(hero.id) && !chosen.includes(hero.id))
    .map((hero) => hero.id);
}

function availableModifiers(
  selector: ModifierSelector,
  bans: HeroesAndModifiers,
  chosen: readonly ModifierId[],
): Modifier[] {
  return modifiers.filter(
    (modifier) =>
      matchesSelector(modifier, selector) &&
      !bans.modifierIds.includes(modifier.id) &&
      !chosen.includes(modifier.id) &&
      isCompatible(modifier, chosen),
  );
}

function matchesSelector(modifier: Modifier, selector: ModifierSelector): boolean {
  switch (selector) {
    case 'good':
    case 'bad':
      return modifier.polarity === selector;
    case 'both':
    case 'balanced':
      return true;
  }
}

/**
 * Balanced allows a polarity while it has fewer than half the slots (rounded up), so 5 rolls 3 + 2;
 * when bans use one polarity up, the other fills in
 */
function modifierPicks({
  selector,
  available,
  chosen,
  size,
}: {
  selector: ModifierSelector;
  available: readonly Modifier[];
  chosen: readonly ModifierId[];
  size: number;
}): readonly Modifier[] {
  if (selector !== 'balanced') {
    return available;
  }

  const allowed = available.filter((modifier) => withinBalancedLimits(modifier, chosen));
  const polarityCap = Math.ceil(size / 2);
  const underCap = allowed.filter(
    (modifier) => countPolarity(chosen, modifier.polarity) < polarityCap,
  );

  return underCap.length > 0 ? underCap : allowed;
}

function withinBalancedLimits(modifier: Modifier, chosen: readonly ModifierId[]): boolean {
  return BALANCED_LIMITS.every(
    ({ ids, max }) =>
      !ids.includes(modifier.id) || chosen.filter((id) => ids.includes(id)).length < max,
  );
}

function countPolarity(ids: readonly ModifierId[], polarity: ModifierPolarity): number {
  return ids.filter((id) => modifierById.get(id)?.polarity === polarity).length;
}

function modifierIds(picks: readonly Modifier[]): ModifierId[] {
  return picks.map((modifier) => modifier.id);
}

function fillSlots<T extends string>({
  previous,
  locked,
  size,
  candidates,
  random,
}: {
  previous: readonly T[];
  locked: readonly T[];
  size: number;
  candidates: (chosen: readonly T[]) => readonly T[];
  random: Random;
}): T[] {
  const lockedInOrder = previous.filter((id) => locked.includes(id));
  const slots = Array.from({ length: Math.max(size, lockedInOrder.length) }, (_, index) => {
    const id = previous[index];

    return id !== undefined && locked.includes(id) ? id : undefined;
  });

  for (const id of lockedInOrder) {
    if (!slots.includes(id)) {
      slots[slots.indexOf(undefined)] = id;
    }
  }

  for (const [index, id] of slots.entries()) {
    if (id === undefined) {
      slots[index] = pickRandom(candidates(slots.filter((slotId) => slotId !== undefined)), random);
    }
  }

  return slots.filter((slotId) => slotId !== undefined);
}

function heroReplacements({ result, locks, bans }: RollContext, index: number): HeroId[] {
  const currentId = result.heroIds[index];

  if (currentId === undefined || locks.heroIds.includes(currentId)) {
    return [];
  }

  return availableHeroes(bans, result.heroIds);
}

function modifierReplacements(
  { settings, result, locks, bans }: RollContext,
  index: number,
): ModifierId[] {
  const currentId = result.modifierIds[index];

  if (currentId === undefined || locks.modifierIds.includes(currentId)) {
    return [];
  }

  // The replaced card leaves, so only the other cards constrain the pick
  const otherIds = result.modifierIds.filter((id) => id !== currentId);
  const picks = modifierPicks({
    selector: settings.selector,
    available: availableModifiers(settings.selector, bans, otherIds).filter(
      (modifier) => modifier.id !== currentId,
    ),
    chosen: otherIds,
    size: result.modifierIds.length,
  });

  if (settings.selector !== 'balanced') {
    return modifierIds(picks);
  }

  // Balanced keeps the replaced card's polarity when it can, so the split stays as rolled
  const currentPolarity = modifierById.get(currentId)?.polarity;
  const samePolarity = picks.filter((modifier) => modifier.polarity === currentPolarity);

  return modifierIds(samePolarity.length > 0 ? samePolarity : picks);
}

function pickRandom<T>(items: readonly T[], random: Random): T | undefined {
  return items[Math.floor(random() * items.length)];
}

function replaceAt<T>(items: readonly T[], index: number, replacement: T): T[] {
  return items.map((item, position) => (position === index ? replacement : item));
}

function clamp(value: number, { min, max }: CountLimits): number {
  return Math.min(Math.max(value, min), max);
}
