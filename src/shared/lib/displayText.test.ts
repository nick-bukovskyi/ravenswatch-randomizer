import { describe, expect, it } from 'vitest';

import { formatScorePercent, formatTimeAgo, toDisplayName } from './displayText.ts';

describe('formatScorePercent', () => {
  it('always shows the sign, with a true minus sign for score losses', () => {
    expect(formatScorePercent(10)).toBe('+10%');
    expect(formatScorePercent(-15)).toBe('−15%');
    expect(formatScorePercent(0)).toBe('0%');
  });
});

describe('toDisplayName', () => {
  it('decomposes the macron so the display font can draw it, keeping the same name', () => {
    const displayName = toDisplayName('Kintarō');

    expect(displayName).not.toBe('Kintarō');
    expect(displayName.normalize('NFC')).toBe('Kintarō');
  });
});

describe('formatTimeAgo', () => {
  const now = Date.UTC(2026, 10, 23, 12);
  const minute = 60_000;

  it('says "Just now" under a minute, including clock skew into the future', () => {
    expect(formatTimeAgo(now - 59_000, now)).toBe('Just now');
    expect(formatTimeAgo(now + minute, now)).toBe('Just now');
  });

  it('uses the largest whole unit that has passed', () => {
    expect(formatTimeAgo(now - minute, now)).toBe('1 minute ago');
    expect(formatTimeAgo(now - 59 * minute, now)).toBe('59 minutes ago');
    expect(formatTimeAgo(now - 3 * 60 * minute, now)).toBe('3 hours ago');
    expect(formatTimeAgo(now - 30 * 60 * minute, now)).toBe('yesterday');
    expect(formatTimeAgo(now - 15 * 24 * 60 * minute, now)).toBe('2 weeks ago');
  });
});
