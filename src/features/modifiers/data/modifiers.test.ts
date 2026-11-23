import { describe, expect, it } from 'vitest';

import { modifierById, modifiers } from './modifiers.ts';

const SHARE_ID = /^[a-z]{2}$/;

describe('modifier data', () => {
  it('has 11 good and 11 bad modifiers with unique 2-letter share IDs', () => {
    const ids = modifiers.map((modifier) => modifier.id);

    expect(new Set(ids).size).toBe(22);

    for (const id of ids) {
      expect(id).toMatch(SHARE_ID);
    }

    expect(modifiers.filter((modifier) => modifier.polarity === 'good')).toHaveLength(11);
    expect(modifiers.filter((modifier) => modifier.polarity === 'bad')).toHaveLength(11);
  });

  it('lists every exclusion both ways and never against itself', () => {
    for (const modifier of modifiers) {
      for (const otherId of modifier.excludes) {
        expect(otherId).not.toBe(modifier.id);
        expect(modifierById.get(otherId)?.excludes).toContain(modifier.id);
      }
    }
  });
});
