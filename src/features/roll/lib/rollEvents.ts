// Reduced motion still emits these; the cards a page loads with emit nothing

import type { CardKind } from './roll.ts';

export interface RollEventMap {
  revealStart: { cards: number };
  cardLand: { kind: CardKind };
  revealEnd: { cards: number };
}

type RollEventName = keyof RollEventMap;
type Listener<Name extends RollEventName> = (detail: RollEventMap[Name]) => void;

const listeners: { [Name in RollEventName]: Set<Listener<Name>> } = {
  revealStart: new Set(),
  cardLand: new Set(),
  revealEnd: new Set(),
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
