const scorePercentFormat = new Intl.NumberFormat('en', {
  style: 'percent',
  signDisplay: 'exceptZero',
  maximumFractionDigits: 0,
});
const relativeTimeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const listFormat = new Intl.ListFormat('en', { type: 'conjunction' });

/** Must stay largest first: the first unit filled at least once wins */
const TIME_AGO_UNITS: readonly (readonly [Intl.RelativeTimeFormatUnit, number])[] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
];

/** Germania One has no precomposed "ō", only the combining macron; display only, not alt text */
export function toDisplayName(name: string): string {
  return name.normalize('NFD');
}

export function formatScorePercent(percent: number): string {
  // Swaps the hyphen for a true minus sign (U+2212)
  return scorePercentFormat.format(percent / 100).replace('-', '−');
}

export function formatList(items: readonly string[]): string {
  return listFormat.format(items);
}

export function formatTimeAgo(timestamp: number, now: number): string {
  const seconds = (now - timestamp) / 1000;

  for (const [unit, unitSeconds] of TIME_AGO_UNITS) {
    if (seconds >= unitSeconds) {
      return relativeTimeFormat.format(-Math.floor(seconds / unitSeconds), unit);
    }
  }

  return 'Just now';
}
