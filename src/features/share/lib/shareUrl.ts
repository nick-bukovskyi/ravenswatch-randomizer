// Share URL contract: `?h=scju&m=qlcoin&t=a&n=3&p=2` (h, m: 2-character IDs joined without a
// separator; t: selector (g good, b bad, a both, e balanced); n: modifier count; p: party size). Bans and locks stay out of it

import { heroById, type HeroId } from '../../heroes/data/heroes.ts';
import { modifierById, type ModifierId } from '../../modifiers/data/modifiers.ts';
import {
  clampSettings,
  isCompatible,
  MAX_MODIFIER_COUNT,
  MAX_PARTY_SIZE,
  MODIFIER_SELECTORS,
  NO_IDS,
  type ModifierSelector,
  type RollContext,
  type RollSettings,
} from '../../roll/lib/roll.ts';

export type SharedRoll = Pick<RollContext, 'result' | 'settings'>;

const SELECTOR_CODES: Record<ModifierSelector, string> = {
  good: 'g',
  bad: 'b',
  both: 'a',
  balanced: 'e',
};

export function encodeShareQuery({ result, settings }: SharedRoll): string {
  const params = new URLSearchParams();

  if (result.heroIds.length > 0) {
    params.set('h', result.heroIds.join(''));
  }
  if (result.modifierIds.length > 0) {
    params.set('m', result.modifierIds.join(''));
  }

  params.set('t', SELECTOR_CODES[settings.selector]);
  params.set('n', String(settings.modifierCount));
  params.set('p', String(settings.partySize));

  return params.toString();
}

/** Drops invalid parts silently; missing or malformed settings keep the `saved` value */
export function decodeShareQuery(query: string, saved: RollSettings): SharedRoll {
  const params = new URLSearchParams(query);

  const selector = MODIFIER_SELECTORS.find((option) => SELECTOR_CODES[option] === params.get('t'));
  const settings = clampSettings(
    {
      selector: selector ?? saved.selector,
      modifierCount: parseCount(params.get('n')) ?? saved.modifierCount,
      partySize: parseCount(params.get('p')) ?? saved.partySize,
    },
    NO_IDS,
  );

  const heroIds: HeroId[] = [];

  for (const code of splitIds(params.get('h'))) {
    const hero = heroById.get(code);

    if (hero && !heroIds.includes(hero.id) && heroIds.length < MAX_PARTY_SIZE) {
      heroIds.push(hero.id);
    }
  }

  const modifierIds: ModifierId[] = [];

  for (const code of splitIds(params.get('m'))) {
    const modifier = modifierById.get(code);

    if (
      modifier &&
      !modifierIds.includes(modifier.id) &&
      isCompatible(modifier, modifierIds) &&
      modifierIds.length < MAX_MODIFIER_COUNT
    ) {
      modifierIds.push(modifier.id);
    }
  }

  return { result: { heroIds, modifierIds }, settings };
}

function splitIds(joined: string | null): string[] {
  return joined?.match(/.{2}/g) ?? [];
}

function parseCount(text: string | null): number | undefined {
  return text !== null && /^\d+$/.test(text) ? Number(text) : undefined;
}
