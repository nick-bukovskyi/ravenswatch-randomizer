import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { heroes, type HeroId } from '../features/heroes/data/heroes.ts';
import { DEFAULT_SETTINGS, NO_IDS, type HeroesAndModifiers } from '../features/roll/lib/roll.ts';
import { HISTORY_LIMIT, parseSavedState, type SavedState } from './savedState.ts';
import { useRandomizerStore } from './useRandomizerStore.ts';

const initialState = useRandomizerStore.getState();

const SAVED_DEFAULTS: SavedState = {
  settings: DEFAULT_SETTINGS,
  bans: NO_IDS,
  muted: false,
  history: [],
};

beforeEach(() => {
  useRandomizerStore.setState(initialState, true);
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(1_000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('roll history', () => {
  it('only refreshes the time when the newest roll repeats', () => {
    rollOnlyHero('sc');
    vi.setSystemTime(2_000);
    rollOnlyHero('sc');

    expect(useRandomizerStore.getState().history).toEqual([
      { query: 'h=sc&t=a&n=5&p=1', timestamp: 2_000 },
    ]);
  });

  it('keeps only the newest rolls up to the limit', () => {
    const rolledIds = heroes.map((hero) => hero.id);

    for (const id of rolledIds) {
      rollOnlyHero(id);
    }

    const newestFirst = rolledIds.slice(-HISTORY_LIMIT).reverse();

    expect(useRandomizerStore.getState().history.map((entry) => entry.query)).toEqual(
      newestFirst.map((id) => `h=${id}&t=a&n=5&p=1`),
    );
  });

  it('replaces the newest entry when a card of the shown roll is re-rolled', () => {
    rollOnlyHero('al');
    rollOnlyHero('sc');
    useRandomizerStore.setState({ bans: bansExcept(['sc', 'ju']) });

    useRandomizerStore.getState().rerollCard('hero', 0);

    expect(useRandomizerStore.getState().history.map((entry) => entry.query)).toEqual([
      'h=ju&t=a&n=5&p=1',
      'h=al&t=a&n=5&p=1',
    ]);
  });
});

describe('toggleHeroBan', () => {
  it('refuses to ban the last available hero', () => {
    const bans = bansExcept(['sc']);

    useRandomizerStore.setState({ bans });

    expect(useRandomizerStore.getState().toggleHeroBan('sc')).toBe(false);
    expect(useRandomizerStore.getState().bans).toEqual(bans);
  });

  it('bans and unbans other heroes', () => {
    const { toggleHeroBan } = useRandomizerStore.getState();

    expect(toggleHeroBan('sc')).toBe(true);
    expect(useRandomizerStore.getState().bans.heroIds).toEqual(['sc']);
    expect(toggleHeroBan('sc')).toBe(true);
    expect(useRandomizerStore.getState().bans.heroIds).toEqual([]);
  });
});

describe('toggleLock', () => {
  it('raises the party size and modifier count to the locked cards', () => {
    useRandomizerStore.setState({
      result: { heroIds: ['sc', 'ju', 'ro'], modifierIds: ['lf', 'ql'] },
      settings: { selector: 'both', modifierCount: 1, partySize: 1 },
    });

    const { toggleLock } = useRandomizerStore.getState();

    toggleLock('hero', 0);
    toggleLock('hero', 2);
    toggleLock('modifier', 0);
    toggleLock('modifier', 1);

    const { locks, settings } = useRandomizerStore.getState();

    expect(locks).toEqual({ heroIds: ['sc', 'ro'], modifierIds: ['lf', 'ql'] });
    expect(settings).toEqual({ selector: 'both', modifierCount: 2, partySize: 2 });
  });
});

describe('restoreFromQuery', () => {
  it('shows the linked roll, adopts its settings and clears the locks', () => {
    useRandomizerStore.setState({
      result: { heroIds: ['al'], modifierIds: ['lf'] },
      locks: { heroIds: ['al'], modifierIds: ['lf'] },
    });

    useRandomizerStore.getState().restoreFromQuery('?h=scju&m=qlco&t=g&n=2&p=2');

    const { result, settings, locks } = useRandomizerStore.getState();

    expect(result).toEqual({ heroIds: ['sc', 'ju'], modifierIds: ['ql', 'co'] });
    expect(settings).toEqual({ selector: 'good', modifierCount: 2, partySize: 2 });
    expect(locks).toEqual(NO_IDS);
  });
});

describe('parseSavedState', () => {
  it('keeps valid saved data', () => {
    const saved: SavedState = {
      settings: { selector: 'bad', modifierCount: 3, partySize: 2 },
      bans: { heroIds: ['sc'], modifierIds: ['lf'] },
      muted: true,
      history: [{ query: 'h=sc&t=b&n=3&p=2', timestamp: 5 }],
    };

    expect(parseSavedState(saved, SAVED_DEFAULTS)).toEqual(saved);
  });

  it('drops a ban list that bans every hero', () => {
    const stored = { bans: { heroIds: heroes.map((hero) => hero.id), modifierIds: [] } };

    expect(parseSavedState(stored, SAVED_DEFAULTS).bans).toEqual(NO_IDS);
  });

  it('falls back for values of the wrong type', () => {
    const stored = {
      settings: { selector: 'worst', modifierCount: '3', partySize: 1.5 },
      bans: 'none',
      muted: 'yes',
      history: { query: 'h=sc' },
    };

    expect(parseSavedState(stored, SAVED_DEFAULTS)).toEqual(SAVED_DEFAULTS);
    expect(parseSavedState('corrupt', SAVED_DEFAULTS)).toEqual(SAVED_DEFAULTS);
  });

  it('drops invalid history entries and entries past the limit', () => {
    const validEntries = Array.from({ length: HISTORY_LIMIT + 2 }, (_, index) => ({
      query: `h=sc&t=a&n=5&p=${index}`,
      timestamp: index,
    }));
    const stored = { history: [{ query: 1, timestamp: 2 }, { query: 'h=sc' }, ...validEntries] };

    expect(parseSavedState(stored, SAVED_DEFAULTS).history).toEqual(
      validEntries.slice(0, HISTORY_LIMIT),
    );
  });
});

function rollOnlyHero(id: HeroId): void {
  useRandomizerStore.setState({ bans: bansExcept([id]) });
  useRandomizerStore.getState().rollHeroes();
}

function bansExcept(availableIds: readonly HeroId[]): HeroesAndModifiers {
  return {
    heroIds: heroes.map((hero) => hero.id).filter((id) => !availableIds.includes(id)),
    modifierIds: [],
  };
}
