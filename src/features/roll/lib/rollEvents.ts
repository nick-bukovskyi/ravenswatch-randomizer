// Reduced motion still emits these; the cards a page loads with emit nothing

import type { CardKind } from './roll.ts';

export interface RollEventMap {
  /** A card starts drawing: every card of a roll, or the one card a re-roll replaces */
  cardStart: { kind: CardKind };
  /** The card's portrait or tile stamp touches down */
  cardStamp: { kind: CardKind };
  /** The ring bursts; `index` is the card's place among the cards revealed together */
  cardRing: { kind: CardKind; id: string; index: number };
  scoreTick: { tick: number };
}

type RollEventName = keyof RollEventMap;
type Listener<Name extends RollEventName> = (detail: RollEventMap[Name]) => void;

const listeners: { [Name in RollEventName]: Set<Listener<Name>> } = {
  cardStart: new Set(),
  cardStamp: new Set(),
  cardRing: new Set(),
  scoreTick: new Set(),
};

export function onRollEvent<Name extends RollEventName>(
  name: Name,
  listener: Listener<Name>,
): () => void {
  listeners[name].add(listener);

  return () => {
    listeners[name].delete(listener);
  };
}

export function emitRollEvent<Name extends RollEventName>(
  name: Name,
  detail: RollEventMap[Name],
): void {
  for (const listener of listeners[name]) {
    listener(detail);
  }
}
