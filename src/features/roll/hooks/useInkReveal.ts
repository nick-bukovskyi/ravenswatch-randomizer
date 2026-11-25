import gsap from 'gsap';
import { useEffect, useEffectEvent, useRef, useState } from 'react';

import { usePrefersReducedMotion } from '../../../shared/hooks/usePrefersReducedMotion.ts';
import { INK_STAGGER_MS, inkRingAt, inkStampAt } from '../lib/inkTiming.ts';
import type { CardKind } from '../lib/roll.ts';
import { emitRollEvent } from '../lib/rollEvents.ts';

interface InkSlot<Id extends string> {
  readonly id: Id;
  readonly key: string;
  /** Fixed for the card's lifetime so a finished reveal never replays */
  readonly delayMs: number;
}

type ChangeKind = 'initial' | 'roll' | 'single' | 'reset';

interface InkChange<Id extends string> {
  readonly kind: ChangeKind;
  readonly cards: readonly { readonly id: Id; readonly delayMs: number }[];
}

interface TrackedGroup<Id extends string> {
  readonly ids: readonly Id[];
  readonly rollId: number;
  readonly slots: readonly InkSlot<Id>[];
  readonly change: InkChange<Id>;
  readonly generation: number;
}

interface InkRevealInput<Id extends string> {
  readonly kind: CardKind;
  readonly ids: readonly Id[];
  readonly rollId: number;
  readonly lockedIds: readonly Id[];
  readonly isLeaving: boolean;
}

export function useInkReveal<Id extends string>({
  kind,
  ids,
  rollId,
  lockedIds,
  isLeaving,
}: InkRevealInput<Id>) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const [tracked, setTracked] = useState<TrackedGroup<Id>>(() => {
    const cards = ids.map((id, index) => ({ id, delayMs: index * INK_STAGGER_MS[kind] }));

    return {
      ids,
      rollId,
      slots: cards.map((card, index) => ({ ...card, key: `0-${index}` })),
      change: { kind: 'initial', cards },
      generation: 0,
    };
  });

  const pendingRef = useRef<gsap.core.Tween[]>([]);

  if (tracked.rollId !== rollId || !sameIds(tracked.ids, ids)) {
    setTracked(nextGroup({ tracked, kind, ids, rollId, lockedIds }));
  }

  const { change } = tracked;
  const lastDelayMs = lastDelay(change);

  const scheduleEvents = useEffectEvent((scheduled: InkChange<Id>) => {
    const pending = pendingRef.current;

    // GSAP calls run on its rAF ticker, so each sound fires on the frame that draws its beat
    const schedule = (delayMs: number, callback: () => void) =>
      pending.push(gsap.delayedCall(delayMs / 1000, callback));

    // Only a roll or a reset replaces cards still landing
    if (scheduled.kind === 'roll' || scheduled.kind === 'reset') {
      killAll(pending);
    }
    if (scheduled.kind === 'initial') {
      return;
    }

    scheduled.cards.forEach((card, index) => {
      schedule(card.delayMs, () => emitRollEvent('cardStart', { kind }));
      schedule(inkStampAt(kind, card.delayMs, prefersReducedMotion), () =>
        emitRollEvent('cardStamp', { kind }),
      );
      schedule(inkRingAt(kind, card.delayMs, prefersReducedMotion), () =>
        emitRollEvent('cardRing', { kind, id: card.id, index }),
      );
    });
  });

  useEffect(() => scheduleEvents(change), [change]);

  useEffect(() => {
    if (isLeaving) {
      killAll(pendingRef.current);
    }
  }, [isLeaving]);

  useEffect(() => {
    const pending = pendingRef.current;

    return () => killAll(pending);
  }, []);

  return { slots: tracked.slots, isSingle: change.kind === 'single', lastDelayMs };
}

function nextGroup<Id extends string>({
  tracked,
  kind,
  ids,
  rollId,
  lockedIds,
}: {
  tracked: TrackedGroup<Id>;
  kind: CardKind;
  ids: readonly Id[];
  rollId: number;
  lockedIds: readonly Id[];
}): TrackedGroup<Id> {
  const generation = tracked.generation + 1;
  const isRoll = tracked.rollId !== rollId;
  const cards: { id: Id; delayMs: number }[] = [];

  const slots = ids.map((id, index): InkSlot<Id> => {
    const previousSlot = tracked.slots[index];
    const isSameCard = tracked.ids[index] === id;

    if (previousSlot && isSameCard && (!isRoll || lockedIds.includes(id))) {
      return previousSlot;
    }

    const delayMs = isRoll ? cards.length * INK_STAGGER_MS[kind] : 0;

    cards.push({ id, delayMs });

    return { id, key: `${generation}-${index}`, delayMs };
  });

  return {
    ids,
    rollId,
    slots,
    change: { kind: changeKind(isRoll, ids.length), cards },
    generation,
  };
}

function changeKind(isRoll: boolean, cardCount: number): ChangeKind {
  if (isRoll) {
    return 'roll';
  }

  return cardCount === 0 ? 'reset' : 'single';
}

function lastDelay<Id extends string>(change: InkChange<Id>): number {
  return Math.max(0, ...change.cards.map((card) => card.delayMs));
}

function sameIds<Id extends string>(left: readonly Id[], right: readonly Id[]): boolean {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}

function killAll(pending: gsap.core.Tween[]): void {
  for (const tween of pending.splice(0)) {
    tween.kill();
  }
}
