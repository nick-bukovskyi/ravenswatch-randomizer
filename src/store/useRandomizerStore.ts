import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { HeroId } from '../features/heroes/data/heroes.ts';
import type { ModifierId } from '../features/modifiers/data/modifiers.ts';
import {
  clampSettings,
  DEFAULT_SETTINGS,
  keepsHeroAvailable,
  NO_IDS,
  NO_SHORTFALL,
  replaceCard,
  rollHeroIds,
  rollModifierIds,
  type CardKind,
  type HeroesAndModifiers,
  type RollContext,
  type RollShortfall,
  type RollSettings,
} from '../features/roll/lib/roll.ts';
import {
  decodeShareQuery,
  encodeShareQuery,
  type SharedRoll,
} from '../features/share/lib/shareUrl.ts';
import {
  clampVolume,
  HISTORY_LIMIT,
  parseSavedState,
  safeLocalStorage,
  STORAGE_KEY,
  type HistoryEntry,
  type SavedState,
} from './savedState.ts';

export interface RandomizerState extends SavedState, RollContext {
  readonly shortfall: RollShortfall;
  readonly heroRollId: number;
  readonly modifierRollId: number;

  rollHeroes: () => void;
  rollModifiers: () => void;
  resetHeroes: () => void;
  resetModifiers: () => void;
  rerollCard: (kind: CardKind, index: number) => void;
  banCard: (kind: CardKind, index: number) => void;
  toggleLock: (kind: CardKind, index: number) => void;
  setSettings: (changes: Partial<RollSettings>) => void;
  toggleHeroBan: (id: HeroId) => boolean;
  toggleModifierBan: (id: ModifierId) => void;
  resetBans: (kind: CardKind) => void;
  setVolume: (volume: number) => void;
  restoreFromQuery: (query: string) => void;
  clearHistory: () => void;
}

const DEFAULT_VOLUME = 0.25;

const savedDefaults: SavedState = {
  settings: DEFAULT_SETTINGS,
  bans: NO_IDS,
  volume: DEFAULT_VOLUME,
  history: [],
};

export const useRandomizerStore = create<RandomizerState>()(
  persist(
    (set, get) => ({
      ...savedDefaults,
      result: NO_IDS,
      locks: NO_IDS,
      shortfall: NO_SHORTFALL,
      heroRollId: 0,
      modifierRollId: 0,

      rollHeroes: () => {
        const state = get();
        const { ids, shortfall } = rollHeroIds(state);
        const result = { ...state.result, heroIds: ids };

        set({
          result,
          shortfall: { ...state.shortfall, heroes: shortfall },
          heroRollId: state.heroRollId + 1,
          history: withEntry(state.history, { result, settings: state.settings }),
        });
      },

      rollModifiers: () => {
        const state = get();
        const { ids, shortfall } = rollModifierIds(state);
        const result = { ...state.result, modifierIds: ids };

        set({
          result,
          shortfall: { ...state.shortfall, modifiers: shortfall },
          modifierRollId: state.modifierRollId + 1,
          history: withEntry(state.history, { result, settings: state.settings }),
        });
      },

      resetHeroes: () => {
        const { result, locks, shortfall } = get();

        set({
          result: { ...result, heroIds: [] },
          locks: { ...locks, heroIds: [] },
          shortfall: { ...shortfall, heroes: 0 },
        });
      },

      resetModifiers: () => {
        const { result, locks, shortfall } = get();

        set({
          result: { ...result, modifierIds: [] },
          locks: { ...locks, modifierIds: [] },
          shortfall: { ...shortfall, modifiers: 0 },
        });
      },

      rerollCard: (kind, index) => {
        const state = get();
        const result = replaceCard(state, kind, index);

        if (result === null) {
          return;
        }

        set({ result, history: withRefinedEntry(state, result) });
      },

      banCard: (kind, index) => {
        const state = get();
        const bans = withCardBanned({ result: state.result, bans: state.bans, kind, index });
        const result = replaceCard({ ...state, bans }, kind, index);

        if (result === null) {
          return;
        }

        set({ bans, result, history: withRefinedEntry(state, result) });
      },

      toggleLock: (kind, index) => {
        const { settings, result, locks } = get();
        const nextLocks = withLockToggled({ result, locks, kind, index });

        set({ locks: nextLocks, settings: clampSettings(settings, nextLocks) });
      },

      setSettings: (changes) => {
        const { settings, locks } = get();

        set({ settings: clampSettings({ ...settings, ...changes }, locks) });
      },

      toggleHeroBan: (id) => {
        const { bans } = get();
        const heroIds = toggled(bans.heroIds, id);

        if (!keepsHeroAvailable(heroIds)) {
          return false;
        }

        set({ bans: { ...bans, heroIds } });

        return true;
      },

      toggleModifierBan: (id) => {
        const { bans } = get();

        set({ bans: { ...bans, modifierIds: toggled(bans.modifierIds, id) } });
      },

      resetBans: (kind) => {
        const { bans } = get();

        set({ bans: kind === 'hero' ? { ...bans, heroIds: [] } : { ...bans, modifierIds: [] } });
      },

      setVolume: (volume) => set({ volume: clampVolume(volume) }),

      restoreFromQuery: (query) => {
        const { settings, heroRollId, modifierRollId } = get();
        const shared = decodeShareQuery(query, settings);

        set({
          result: shared.result,
          settings: shared.settings,
          locks: NO_IDS,
          shortfall: NO_SHORTFALL,
          heroRollId: heroRollId + 1,
          modifierRollId: modifierRollId + 1,
        });
      },

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => safeLocalStorage),
      // No result or locks: the URL carries the roll, and locks never outlive the page
      partialize: ({ settings, bans, volume, history }): SavedState => ({
        settings,
        bans,
        volume,
        history,
      }),
      merge: (stored, current) => ({ ...current, ...parseSavedState(stored, current) }),
    },
  ),
);

function withEntry(history: readonly HistoryEntry[], roll: SharedRoll): HistoryEntry[] {
  const query = encodeShareQuery(roll);
  const older = history[0]?.query === query ? history.slice(1) : history;

  return [{ query, timestamp: Date.now() }, ...older].slice(0, HISTORY_LIMIT);
}

function withRefinedEntry(state: RandomizerState, result: HeroesAndModifiers): HistoryEntry[] {
  const isNewestShown = state.history[0]?.query === encodeShareQuery(state);
  const history = isNewestShown ? state.history.slice(1) : state.history;

  return withEntry(history, { result, settings: state.settings });
}

function withCardBanned({
  result,
  bans,
  kind,
  index,
}: {
  result: HeroesAndModifiers;
  bans: HeroesAndModifiers;
  kind: CardKind;
  index: number;
}): HeroesAndModifiers {
  switch (kind) {
    case 'hero': {
      const id = result.heroIds[index];

      return id === undefined || bans.heroIds.includes(id)
        ? bans
        : { ...bans, heroIds: [...bans.heroIds, id] };
    }
    case 'modifier': {
      const id = result.modifierIds[index];

      return id === undefined || bans.modifierIds.includes(id)
        ? bans
        : { ...bans, modifierIds: [...bans.modifierIds, id] };
    }
  }
}

function withLockToggled({
  result,
  locks,
  kind,
  index,
}: {
  result: HeroesAndModifiers;
  locks: HeroesAndModifiers;
  kind: CardKind;
  index: number;
}): HeroesAndModifiers {
  switch (kind) {
    case 'hero': {
      const id = result.heroIds[index];

      return id === undefined ? locks : { ...locks, heroIds: toggled(locks.heroIds, id) };
    }
    case 'modifier': {
      const id = result.modifierIds[index];

      return id === undefined ? locks : { ...locks, modifierIds: toggled(locks.modifierIds, id) };
    }
  }
}

function toggled<T>(ids: readonly T[], id: T): T[] {
  return ids.includes(id) ? ids.filter((existing) => existing !== id) : [...ids, id];
}
