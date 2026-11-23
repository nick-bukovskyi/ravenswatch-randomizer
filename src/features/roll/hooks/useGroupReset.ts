import { useEffect, useState } from 'react';

import { usePrefersReducedMotion } from '../../../shared/hooks/usePrefersReducedMotion.ts';
import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import { leaveDuration } from '../lib/inkTiming.ts';
import type { CardKind } from '../lib/roll.ts';

interface GroupResetInput {
  readonly kind: CardKind;
  readonly rollId: number;
  readonly cardCount: number;
}

/** A roll or restore changes `rollId`, which cancels a leave in progress */
export function useGroupReset({ kind, rollId, cardCount }: GroupResetInput) {
  const resetGroup = useRandomizerStore((state) =>
    kind === 'hero' ? state.resetHeroes : state.resetModifiers,
  );
  const prefersReducedMotion = usePrefersReducedMotion();

  const [leavingRollId, setLeavingRollId] = useState<number | null>(null);
  const [hasShownCards, setHasShownCards] = useState(cardCount > 0);

  const isLeaving = leavingRollId === rollId && cardCount > 0;
  const duration = leaveDuration(kind, cardCount, prefersReducedMotion);

  if (cardCount > 0 && !hasShownCards) {
    setHasShownCards(true);
  }

  function startReset() {
    setLeavingRollId(rollId);
  }

  useEffect(() => {
    if (!isLeaving) {
      return;
    }

    const timer = window.setTimeout(resetGroup, duration);

    return () => window.clearTimeout(timer);
  }, [isLeaving, duration, resetGroup]);

  return { isLeaving, hasShownCards, startReset };
}
