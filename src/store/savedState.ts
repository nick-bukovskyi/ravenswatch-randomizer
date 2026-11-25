import type { StateStorage } from 'zustand/middleware';

import { heroes } from '../features/heroes/data/heroes.ts';
import { modifiers } from '../features/modifiers/data/modifiers.ts';
import {
  clampSettings,
  keepsHeroAvailable,
  MODIFIER_SELECTORS,
  NO_IDS,
  type HeroesAndModifiers,
  type RollSettings,
} from '../features/roll/lib/roll.ts';

/** Stored as a share query so restoring it brings back its settings too */
export interface HistoryEntry {
  readonly query: string;
  readonly timestamp: number;
}

export interface SavedState {
  readonly settings: RollSettings;
  readonly bans: HeroesAndModifiers;
  /** Master sound volume from 0 (muted) to 1 */
  readonly volume: number;
  readonly history: readonly HistoryEntry[];
}

export const STORAGE_KEY = 'ravenswatch-randomizer';
export const HISTORY_LIMIT = 10;

// Storage can be missing or throw (private mode, blocked site data, full quota)
export const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      // Not saved
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      // Not removed
    }
  },
};

/** Saved data is untrusted (older versions, manual edits) */
export function parseSavedState(stored: unknown, fallback: SavedState): SavedState {
  if (typeof stored !== 'object' || stored === null) {
    return fallback;
  }

  return {
    settings:
      'settings' in stored ? parseSettings(stored.settings, fallback.settings) : fallback.settings,
    bans: 'bans' in stored ? parseBans(stored.bans) : fallback.bans,
    volume: parseVolume(stored, fallback.volume),
    history: 'history' in stored ? parseHistory(stored.history) : fallback.history,
  };
}

export function clampVolume(volume: number): number {
  return Math.min(1, Math.max(0, volume));
}

function parseVolume(stored: object, fallback: number): number {
  if ('volume' in stored && typeof stored.volume === 'number' && Number.isFinite(stored.volume)) {
    return clampVolume(stored.volume);
  }

  // Saved before the volume control existed: a muted player stays muted
  return 'muted' in stored && stored.muted === true ? 0 : fallback;
}

function parseSettings(stored: unknown, fallback: RollSettings): RollSettings {
  if (typeof stored !== 'object' || stored === null) {
    return fallback;
  }

  const selector = MODIFIER_SELECTORS.find(
    (option) => 'selector' in stored && stored.selector === option,
  );
  const modifierCount = 'modifierCount' in stored ? stored.modifierCount : undefined;
  const partySize = 'partySize' in stored ? stored.partySize : undefined;

  return clampSettings(
    {
      selector: selector ?? fallback.selector,
      modifierCount:
        typeof modifierCount === 'number' && Number.isInteger(modifierCount)
          ? modifierCount
          : fallback.modifierCount,
      partySize:
        typeof partySize === 'number' && Number.isInteger(partySize)
          ? partySize
          : fallback.partySize,
    },
    NO_IDS,
  );
}

function parseBans(stored: unknown): HeroesAndModifiers {
  if (typeof stored !== 'object' || stored === null) {
    return NO_IDS;
  }

  const storedHeroIds: unknown[] =
    'heroIds' in stored && Array.isArray(stored.heroIds) ? stored.heroIds : [];
  const storedModifierIds: unknown[] =
    'modifierIds' in stored && Array.isArray(stored.modifierIds) ? stored.modifierIds : [];

  const heroIds = heroes.map((hero) => hero.id).filter((id) => storedHeroIds.includes(id));

  return {
    heroIds: keepsHeroAvailable(heroIds) ? heroIds : [],
    modifierIds: modifiers
      .map((modifier) => modifier.id)
      .filter((id) => storedModifierIds.includes(id)),
  };
}

function parseHistory(stored: unknown): HistoryEntry[] {
  if (!Array.isArray(stored)) {
    return [];
  }

  return stored
    .flatMap((entry: unknown) => {
      if (
        typeof entry !== 'object' ||
        entry === null ||
        !('query' in entry) ||
        !('timestamp' in entry)
      ) {
        return [];
      }
      if (typeof entry.query !== 'string' || typeof entry.timestamp !== 'number') {
        return [];
      }

      return [{ query: entry.query, timestamp: entry.timestamp }];
    })
    .slice(0, HISTORY_LIMIT);
}
