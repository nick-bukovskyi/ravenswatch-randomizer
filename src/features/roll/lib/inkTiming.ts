// Mirrors the beats of features/roll/styles/ink-reveal.css, in milliseconds; keep both in sync

import type { CardKind } from './roll.ts';

export const INK_STAGGER_MS: Record<CardKind, number> = { hero: 420, modifier: 300 };

const LEAVE_STAGGER_MS: Record<CardKind, number> = { hero: 140, modifier: 90 };

/** The ring around the portrait or tile pops */
const LAND_AT_MS: Record<CardKind, number> = { hero: 1130, modifier: 330 };

/** The name or the score has finished */
const SETTLED_AT_MS: Record<CardKind, number> = { hero: 1900, modifier: 1300 };

const LEFT_AT_MS: Record<CardKind, number> = { hero: 800, modifier: 720 };

const REDUCED_FADE_MS = 300;

const REROLL_SCORE_AT_MS = 900;

const ROLL_SCORE_AFTER_MS = 1200;

export function inkLandAt(kind: CardKind, delayMs: number, prefersReducedMotion: boolean): number {
  return prefersReducedMotion ? delayMs : delayMs + LAND_AT_MS[kind];
}

export function inkSettledAt(
  kind: CardKind,
  lastDelayMs: number,
  prefersReducedMotion: boolean,
): number {
  return lastDelayMs + (prefersReducedMotion ? REDUCED_FADE_MS : SETTLED_AT_MS[kind]);
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

export function scoreCountAt({
  isSingle,
  lastDelayMs,
  prefersReducedMotion,
}: {
  isSingle: boolean;
  lastDelayMs: number;
  prefersReducedMotion: boolean;
}): number {
  if (prefersReducedMotion) {
    return isSingle ? 0 : lastDelayMs;
  }

  return isSingle ? REROLL_SCORE_AT_MS : lastDelayMs + ROLL_SCORE_AFTER_MS;
}
