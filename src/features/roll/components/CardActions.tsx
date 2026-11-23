import { use, type MouseEvent } from 'react';

import { Icon } from '../../../shared/ui/Icon.tsx';
import { Tooltip } from '../../../shared/ui/Tooltip.tsx';
import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import { RerollFocusContext } from '../lib/rerollFocusContext.ts';
import { canReplaceCard, type CardKind } from '../lib/roll.ts';

interface CardActionsProps {
  kind: CardKind;
  slot: number;
  name: string;
  isLocked: boolean;
  className: string;
  onRefuse: () => void;
}

export function CardActions({ kind, slot, name, isLocked, className, onRefuse }: CardActionsProps) {
  const canReroll = useRandomizerStore((state) => canReplaceCard(state, kind, slot));
  const rerollCard = useRandomizerStore((state) => state.rerollCard);
  const toggleLock = useRandomizerStore((state) => state.toggleLock);
  const rerollFocusRef = use(RerollFocusContext);

  const isRerollAvailable = canReroll && !isLocked;

  function handleReroll(event: MouseEvent<HTMLButtonElement>) {
    if (!isRerollAvailable) {
      onRefuse();

      return;
    }

    // A re-roll remounts the card, so the new card's button takes the focus
    if (event.currentTarget === document.activeElement) {
      rerollFocusRef.current = slot;
    }

    rerollCard(kind, slot);
  }

  function takeOverFocus(button: HTMLButtonElement | null) {
    if (button && rerollFocusRef.current === slot) {
      rerollFocusRef.current = null;
      button.focus({ preventScroll: true });
    }
  }

  return (
    <div className={className}>
      <Tooltip content={rerollHint(isLocked, canReroll)}>
        <button
          ref={takeOverFocus}
          type="button"
          aria-label={`Re-roll ${name}`}
          aria-disabled={!isRerollAvailable || undefined}
          className="card-actions__button"
          onClick={handleReroll}
        >
          <Icon name="reroll" />
        </button>
      </Tooltip>
      <Tooltip content={isLocked ? 'Unlock' : 'Lock'}>
        <button
          type="button"
          aria-label={`Lock ${name}`}
          aria-pressed={isLocked}
          className="card-actions__button"
          onClick={() => toggleLock(kind, slot)}
        >
          <Icon name={isLocked ? 'lock' : 'unlock'} />
        </button>
      </Tooltip>
    </div>
  );
}

function rerollHint(isLocked: boolean, canReroll: boolean): string {
  if (isLocked) {
    return 'Unlock to re-roll';
  }

  return canReroll ? 'Re-roll' : 'Nothing else to re-roll into';
}
