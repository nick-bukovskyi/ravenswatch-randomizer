import { describe, expect, it } from 'vitest';

import { heroes } from './heroes.ts';

const SHARE_ID = /^[a-z]{2}$/;

describe('hero data', () => {
  it('has 13 heroes with unique 2-letter share IDs', () => {
    const ids = heroes.map((hero) => hero.id);

    expect(ids).toHaveLength(13);
    expect(new Set(ids).size).toBe(ids.length);

    for (const id of ids) {
      expect(id).toMatch(SHARE_ID);
    }
  });
});
