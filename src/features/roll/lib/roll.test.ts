import { describe, expect, it } from 'vitest';

import { heroes, type HeroId } from '../../heroes/data/heroes.ts';
import { modifiers, type ModifierId } from '../../modifiers/data/modifiers.ts';
import {
  canReplaceCard,
  clampSettings,
  DEFAULT_SETTINGS,
  MODIFIER_SELECTORS,
  NO_IDS,
  replaceCard,
  rollHeroIds,
  rollModifierIds,
  scoreTotalPercent,
  settingsLimits,
  type HeroesAndModifiers,
  type Random,
  type RollContext,
} from './roll.ts';

const SEEDS = Array.from({ length: 200 }, (_, index) => index + 1);

const goodIds = modifiers.filter((modifier) => modifier.polarity === 'good').map(({ id }) => id);
const badIds = modifiers.filter((modifier) => modifier.polarity === 'bad').map(({ id }) => id);

describe('rollHeroIds', () => {
  it('rolls the requested party size without duplicate heroes', () => {
    for (const partySize of [1, 2, 3, 4]) {
      for (const seed of SEEDS) {
        const { ids, shortfall } = rollHeroIds(
          contextWith({ settings: { ...DEFAULT_SETTINGS, partySize } }),
          seededRandom(seed),
        );

        expect(ids).toHaveLength(partySize);
        expect(new Set(ids).size).toBe(partySize);
        expect(shortfall).toBe(0);
      }
    }
  });

  it('never rolls banned heroes', () => {
    const bannedIds: readonly HeroId[] = ['sc', 'ju', 'ro'];

    for (const seed of SEEDS) {
      const { ids } = rollHeroIds(
        contextWith({
          bans: { heroIds: bannedIds, modifierIds: [] },
          settings: { ...DEFAULT_SETTINGS, partySize: 4 },
        }),
        seededRandom(seed),
      );

      expect(ids.some((id) => bannedIds.includes(id))).toBe(false);
    }
  });

  it('uses what is available and reports the shortfall when bans leave the pool short', () => {
    const bannedIds = heroes.map(({ id }) => id).filter((id) => id !== 'sc' && id !== 'ju');

    const { ids, shortfall } = rollHeroIds(
      contextWith({
        bans: { heroIds: bannedIds, modifierIds: [] },
        settings: { ...DEFAULT_SETTINGS, partySize: 4 },
      }),
      seededRandom(1),
    );

    expect([...ids].sort()).toEqual(['ju', 'sc']);
    expect(shortfall).toBe(2);
  });

  it('keeps locked heroes in their places', () => {
    for (const seed of SEEDS) {
      const { ids } = rollHeroIds(
        contextWith({
          result: { heroIds: ['sc', 'ju', 'ro'], modifierIds: [] },
          locks: { heroIds: ['ju'], modifierIds: [] },
          settings: { ...DEFAULT_SETTINGS, partySize: 3 },
        }),
        seededRandom(seed),
      );

      expect(ids).toHaveLength(3);
      expect(ids[1]).toBe('ju');
      expect(new Set(ids).size).toBe(3);
    }
  });

  it('keeps locked heroes that sit past a smaller party size', () => {
    for (const seed of SEEDS) {
      const { ids } = rollHeroIds(
        contextWith({
          result: { heroIds: ['sc', 'ju', 'ro', 'al'], modifierIds: [] },
          locks: { heroIds: ['al'], modifierIds: [] },
          settings: { ...DEFAULT_SETTINGS, partySize: 2 },
        }),
        seededRandom(seed),
      );

      expect(ids).toHaveLength(2);
      expect(ids).toContain('al');
    }
  });

  it('keeps a locked hero even after it is banned', () => {
    const { ids } = rollHeroIds(
      contextWith({
        result: { heroIds: ['sc'], modifierIds: [] },
        locks: { heroIds: ['sc'], modifierIds: [] },
        bans: { heroIds: ['sc'], modifierIds: [] },
      }),
      seededRandom(1),
    );

    expect(ids).toEqual(['sc']);
  });

  it('does not depend on the modifier side of the context', () => {
    for (const seed of SEEDS) {
      const plain = rollHeroIds(contextWith({}), seededRandom(seed));
      const withModifiers = rollHeroIds(
        contextWith({
          settings: { ...DEFAULT_SETTINGS, selector: 'bad', modifierCount: 2 },
          result: { heroIds: [], modifierIds: ['id', 'co'] },
          locks: { heroIds: [], modifierIds: ['co'] },
          bans: { heroIds: [], modifierIds: ['lf', 'ql'] },
        }),
        seededRandom(seed),
      );

      expect(withModifiers).toEqual(plain);
    }
  });
});

describe('rollModifierIds', () => {
  it('rolls the requested modifier count from the selected polarity only', () => {
    for (const seed of SEEDS) {
      const good = rollModifierIds(
        contextWith({ settings: { selector: 'good', modifierCount: 5, partySize: 1 } }),
        seededRandom(seed),
      );
      const bad = rollModifierIds(
        contextWith({ settings: { selector: 'bad', modifierCount: 4, partySize: 1 } }),
        seededRandom(seed),
      );
      const both = rollModifierIds(
        contextWith({ settings: { selector: 'both', modifierCount: 5, partySize: 1 } }),
        seededRandom(seed),
      );

      expect(good.ids).toHaveLength(5);
      expect(good.ids.every((id) => goodIds.includes(id))).toBe(true);
      expect(bad.ids).toHaveLength(4);
      expect(bad.ids.every((id) => badIds.includes(id))).toBe(true);
      expect(both.ids).toHaveLength(5);
      expect(new Set(both.ids).size).toBe(5);
    }
  });

  it('never rolls Eternal Sun together with Solar Eclipse and reports the shortfall', () => {
    const bannedIds = goodIds.filter((id) => !['es', 'se', 'lf', 'ql'].includes(id));

    for (const seed of SEEDS) {
      const { ids, shortfall } = rollModifierIds(
        contextWith({
          bans: { heroIds: [], modifierIds: bannedIds },
          settings: { selector: 'good', modifierCount: 5, partySize: 1 },
        }),
        seededRandom(seed),
      );

      expect(ids).toHaveLength(3);
      expect(shortfall).toBe(2);
      expect(ids.includes('es') && ids.includes('se')).toBe(false);
    }
  });

  it('never rolls Explorer together with Oppressive Nightmare', () => {
    const kept: readonly ModifierId[] = ['ex', 'lf', 'on', 'co'];
    const bans = {
      heroIds: [],
      modifierIds: [...goodIds, ...badIds].filter((id) => !kept.includes(id)),
    };

    for (const seed of SEEDS) {
      const { ids, shortfall } = rollModifierIds(
        contextWith({ bans, settings: { selector: 'both', modifierCount: 4, partySize: 1 } }),
        seededRandom(seed),
      );

      expect(ids).toHaveLength(3);
      expect(shortfall).toBe(1);
      expect(ids.includes('ex') && ids.includes('on')).toBe(false);
    }
  });

  it('never rolls banned modifiers', () => {
    const bannedIds: readonly ModifierId[] = ['lf', 'id', 'co'];

    for (const seed of SEEDS) {
      const { ids } = rollModifierIds(
        contextWith({
          bans: { heroIds: [], modifierIds: bannedIds },
          settings: { selector: 'both', modifierCount: 5, partySize: 1 },
        }),
        seededRandom(seed),
      );

      expect(ids.some((id) => bannedIds.includes(id))).toBe(false);
    }
  });

  it('uses what is available and reports the shortfall when bans leave the pool short', () => {
    const bannedIds = badIds.filter((id) => id !== 'id' && id !== 'co');

    const { ids, shortfall } = rollModifierIds(
      contextWith({
        bans: { heroIds: [], modifierIds: bannedIds },
        settings: { selector: 'bad', modifierCount: 5, partySize: 1 },
      }),
      seededRandom(1),
    );

    expect([...ids].sort()).toEqual(['co', 'id']);
    expect(shortfall).toBe(3);
  });

  it('keeps locked modifiers in their places', () => {
    for (const seed of SEEDS) {
      const { ids } = rollModifierIds(
        contextWith({
          result: { heroIds: [], modifierIds: ['lf', 'ql', 'id'] },
          locks: { heroIds: [], modifierIds: ['ql'] },
          settings: { selector: 'both', modifierCount: 3, partySize: 1 },
        }),
        seededRandom(seed),
      );

      expect(ids).toHaveLength(3);
      expect(ids[1]).toBe('ql');
    }
  });

  it('keeps a locked modifier that does not match the selector and counts it', () => {
    for (const seed of SEEDS) {
      const { ids } = rollModifierIds(
        contextWith({
          result: { heroIds: [], modifierIds: ['lf', 'id'] },
          locks: { heroIds: [], modifierIds: ['id'] },
          settings: { selector: 'good', modifierCount: 3, partySize: 1 },
        }),
        seededRandom(seed),
      );

      expect(ids).toHaveLength(3);
      expect(ids[1]).toBe('id');
      expect(ids.filter((id) => goodIds.includes(id))).toHaveLength(2);
    }
  });

  it('keeps a locked modifier even after it is banned', () => {
    const { ids } = rollModifierIds(
      contextWith({
        result: { heroIds: [], modifierIds: ['lf'] },
        locks: { heroIds: [], modifierIds: ['lf'] },
        bans: { heroIds: [], modifierIds: ['lf'] },
        settings: { selector: 'good', modifierCount: 1, partySize: 1 },
      }),
      seededRandom(1),
    );

    expect(ids).toEqual(['lf']);
  });

  it('never adds a modifier that conflicts with a locked one', () => {
    for (const seed of SEEDS) {
      const { ids } = rollModifierIds(
        contextWith({
          result: { heroIds: [], modifierIds: ['es'] },
          locks: { heroIds: [], modifierIds: ['es'] },
          settings: { selector: 'good', modifierCount: 5, partySize: 1 },
        }),
        seededRandom(seed),
      );

      expect(ids).toContain('es');
      expect(ids).not.toContain('se');
    }
  });

  it('does not depend on the hero side of the context', () => {
    for (const seed of SEEDS) {
      const plain = rollModifierIds(contextWith({}), seededRandom(seed));
      const withHeroes = rollModifierIds(
        contextWith({
          settings: { ...DEFAULT_SETTINGS, partySize: 3 },
          result: { heroIds: ['sc', 'ju', 'ro'], modifierIds: [] },
          locks: { heroIds: ['ju'], modifierIds: [] },
          bans: { heroIds: ['al', 'me'], modifierIds: [] },
        }),
        seededRandom(seed),
      );

      expect(withHeroes).toEqual(plain);
    }
  });
});

describe('Balanced modifier rolls', () => {
  it('keeps the good and bad counts within one of each other', () => {
    for (const modifierCount of [1, 2, 3, 4, 5]) {
      for (const seed of SEEDS) {
        const { ids, shortfall } = rollModifierIds(
          contextWith({ settings: { selector: 'balanced', modifierCount, partySize: 1 } }),
          seededRandom(seed),
        );
        const good = ids.filter((id) => goodIds.includes(id)).length;

        expect(ids).toHaveLength(modifierCount);
        expect(shortfall).toBe(0);
        expect(Math.abs(good - (modifierCount - good))).toBeLessThanOrEqual(1);
      }
    }
  });

  it('never rolls Living the Dream with Inflation, nor all three healing penalties', () => {
    const kept: readonly ModifierId[] = ['ld', 'lf', 'ql', 'in', 'di', 'df', 'bl'];
    const bans = {
      heroIds: [],
      modifierIds: [...goodIds, ...badIds].filter((id) => !kept.includes(id)),
    };

    for (const seed of SEEDS) {
      const { ids } = rollModifierIds(
        contextWith({ bans, settings: { selector: 'balanced', modifierCount: 5, partySize: 1 } }),
        seededRandom(seed),
      );

      expect(ids.includes('ld') && ids.includes('in')).toBe(false);
      expect(['di', 'df', 'bl'].every((id) => ids.some((rolledId) => rolledId === id))).toBe(false);
    }
  });

  it('fills from the other polarity when bans use one up', () => {
    const bans = { heroIds: [], modifierIds: goodIds.filter((id) => id !== 'lf') };

    const { ids, shortfall } = rollModifierIds(
      contextWith({ bans, settings: { selector: 'balanced', modifierCount: 5, partySize: 1 } }),
      seededRandom(1),
    );

    expect(ids).toHaveLength(5);
    expect(shortfall).toBe(0);
    expect(ids.filter((id) => goodIds.includes(id))).toEqual(['lf']);
  });

  it('keeps the polarity of a re-rolled card', () => {
    const context = contextWith({
      result: { heroIds: [], modifierIds: ['lf', 'ql', 'sh', 'co', 'di'] },
      settings: { selector: 'balanced', modifierCount: 5, partySize: 1 },
    });

    for (const seed of SEEDS) {
      const goodReplaced = replaceCard(context, 'modifier', 0, seededRandom(seed));
      const badReplaced = replaceCard(context, 'modifier', 3, seededRandom(seed));

      expect(goodIds).toContain(goodReplaced?.modifierIds[0]);
      expect(badIds).toContain(badReplaced?.modifierIds[3]);
    }
  });
});

describe('replaceCard', () => {
  it('replaces only the chosen hero with one that is not shown or banned', () => {
    const shown: HeroesAndModifiers = { heroIds: ['sc', 'ju', 'ro'], modifierIds: [] };
    const bans: HeroesAndModifiers = { heroIds: ['al', 'me'], modifierIds: [] };

    for (const seed of SEEDS) {
      const replaced = replaceCard(
        contextWith({ result: shown, bans, settings: { ...DEFAULT_SETTINGS, partySize: 3 } }),
        'hero',
        1,
        seededRandom(seed),
      );

      expect(replaced?.heroIds[0]).toBe('sc');
      expect(replaced?.heroIds[2]).toBe('ro');
      expect(['sc', 'ju', 'ro', 'al', 'me']).not.toContain(replaced?.heroIds[1]);
    }
  });

  it('replaces a modifier with one that matches the selector and fits the other cards', () => {
    const shown: HeroesAndModifiers = { heroIds: ['sc'], modifierIds: ['es', 'id'] };

    for (const seed of SEEDS) {
      const replaced = replaceCard(
        contextWith({
          result: shown,
          settings: { selector: 'good', modifierCount: 2, partySize: 1 },
        }),
        'modifier',
        1,
        seededRandom(seed),
      );
      const newId = replaced?.modifierIds[1];

      expect(replaced?.modifierIds[0]).toBe('es');
      expect(goodIds).toContain(newId);
      expect(newId).not.toBe('es');
      expect(newId).not.toBe('se');
    }
  });

  it('may swap a modifier for the one it excludes, because the replaced card leaves', () => {
    const bans = { heroIds: [], modifierIds: goodIds.filter((id) => id !== 'es' && id !== 'se') };

    const replaced = replaceCard(
      contextWith({
        result: { heroIds: ['sc'], modifierIds: ['es'] },
        bans,
        settings: { selector: 'good', modifierCount: 1, partySize: 1 },
      }),
      'modifier',
      0,
      seededRandom(1),
    );

    expect(replaced?.modifierIds).toEqual(['se']);
  });

  it('is unavailable when no valid replacement exists', () => {
    const context = contextWith({
      result: { heroIds: ['sc'], modifierIds: [] },
      bans: { heroIds: heroes.map(({ id }) => id).filter((id) => id !== 'sc'), modifierIds: [] },
    });

    expect(canReplaceCard(context, 'hero', 0)).toBe(false);
    expect(replaceCard(context, 'hero', 0, seededRandom(1))).toBeNull();
  });

  it('is unavailable for a locked card', () => {
    const context = contextWith({
      result: { heroIds: ['sc'], modifierIds: ['lf'] },
      locks: { heroIds: ['sc'], modifierIds: ['lf'] },
    });

    expect(canReplaceCard(context, 'hero', 0)).toBe(false);
    expect(canReplaceCard(context, 'modifier', 0)).toBe(false);
    expect(replaceCard(context, 'hero', 0, seededRandom(1))).toBeNull();
    expect(replaceCard(context, 'modifier', 0, seededRandom(1))).toBeNull();
  });

  it('is available for an unlocked card with free replacements', () => {
    const context = contextWith({ result: { heroIds: ['sc'], modifierIds: ['lf'] } });

    expect(canReplaceCard(context, 'hero', 0)).toBe(true);
    expect(canReplaceCard(context, 'modifier', 0)).toBe(true);
  });
});

describe('settings limits', () => {
  it('allows a party of 1 to 4 and 1 to 5 modifiers, the game cap', () => {
    expect(settingsLimits(NO_IDS)).toEqual({
      partySize: { min: 1, max: 4 },
      modifierCount: { min: 1, max: 5 },
    });
  });

  it('never lets party size or modifier count go below the locked cards', () => {
    const locks: HeroesAndModifiers = { heroIds: ['sc', 'ju'], modifierIds: ['lf', 'ql', 'id'] };

    expect(clampSettings({ selector: 'good', modifierCount: 1, partySize: 1 }, locks)).toEqual({
      selector: 'good',
      modifierCount: 3,
      partySize: 2,
    });
  });

  it('clamps out-of-range values into the allowed range for every selector', () => {
    for (const selector of MODIFIER_SELECTORS) {
      expect(clampSettings({ selector, modifierCount: 30, partySize: 9 }, NO_IDS)).toEqual({
        selector,
        modifierCount: 5,
        partySize: 4,
      });
    }

    expect(clampSettings({ selector: 'both', modifierCount: 0, partySize: 0 }, NO_IDS)).toEqual({
      selector: 'both',
      modifierCount: 1,
      partySize: 1,
    });
  });
});

describe('scoreTotalPercent', () => {
  it('sums the score percentages of the modifiers', () => {
    expect(scoreTotalPercent(['lf', 'id', 'co'])).toBe(10);
    expect(scoreTotalPercent(['co', 'di'])).toBe(30);
    expect(scoreTotalPercent([])).toBe(0);
  });
});

function contextWith(overrides: Partial<RollContext>): RollContext {
  return { settings: DEFAULT_SETTINGS, bans: NO_IDS, result: NO_IDS, locks: NO_IDS, ...overrides };
}

/** Mulberry32 PRNG */
function seededRandom(seed: number): Random {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = Math.imul(state ^ (state >>> 15), state | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);

    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}
