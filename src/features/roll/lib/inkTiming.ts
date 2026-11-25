// Mirrors the beats of features/roll/styles/ink-reveal.css, in milliseconds; keep both in sync

import type { CardKind } from './roll.ts';

/** What changed a group's cards: `initial` is the page load, `single` a re-roll of one card */
export type InkChangeKind = 'initial' | 'roll' | 'single' | 'reset';

/** The `data-ink` state of a card: cards a page loads with (no delay) show at rest */
type InkState = 'in' | 'out' | 'rest';

export const INK_STAGGER_MS: Record<CardKind, number> = { hero: 420, modifier: 300 };

const LEAVE_STAGGER_MS: Record<CardKind, number> = { hero: 140, modifier: 90 };

/**
 * The portrait or tile stamp touches down: `ink-stamp` starts at +900 / +60 and its scale reaches 1
 * 64 ms in, through the `--ease-ink-stamp` overshoot
 */
const STAMP_AT_MS: Record<CardKind, number> = { hero: 964, modifier: 124 };

/** The ring around the portrait or tile pops */
const RING_AT_MS: Record<CardKind, number> = { hero: 1130, modifier: 330 };

const LEFT_AT_MS: Record<CardKind, number> = { hero: 800, modifier: 720 };

const REDUCED_FADE_MS = 300;

const REROLL_SCORE_AT_MS = 900;

const ROLL_SCORE_AFTER_MS = 1200;

export function inkStampAt(kind: CardKind, delayMs: number, prefersReducedMotion: boolean): number {
  return prefersReducedMotion ? delayMs : delayMs + STAMP_AT_MS[kind];
}

export function inkRingAt(kind: CardKind, delayMs: number, prefersReducedMotion: boolean): number {
  return prefersReducedMotion ? delayMs : delayMs + RING_AT_MS[kind];
}

export function leaveDuration(
  kind: CardKind,
  cardCount: number,
  prefersReducedMotion: boolean,
): number {
  if (prefersReducedMotion) {
    return REDUCED_FADE_MS;
  }

  return Math.max(0, cardCount - 1) * LEAVE_STAGGER_MS[kind] + LEFT_AT_MS[kind];
}

export function leaveDelayAt(kind: CardKind, slot: number, cardCount: number): number {
  return (cardCount - 1 - slot) * LEAVE_STAGGER_MS[kind];
}

export function inkState(isLeaving: boolean, delayMs: number | null): InkState {
  if (isLeaving) {
    return 'out';
  }

  return delayMs === null ? 'rest' : 'in';
}

/** Null when the page loaded with these cards: the score then shows without counting */
export function scoreCountAt({
  changeKind,
  lastDelayMs,
  prefersReducedMotion,
}: {
  changeKind: InkChangeKind;
  lastDelayMs: number;
  prefersReducedMotion: boolean;
}): number | null {
  if (changeKind === 'initial') {
    return null;
  }

  const isSingle = changeKind === 'single';

  if (prefersReducedMotion) {
    return isSingle ? 0 : lastDelayMs;
  }

  return isSingle ? REROLL_SCORE_AT_MS : lastDelayMs + ROLL_SCORE_AFTER_MS;
}
