import { use, type MouseEvent } from 'react';

import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import { playBan, playLock, playUnlock } from '../../sound/lib/soundEffects.ts';
import { RerollFocusContext } from '../lib/rerollFocusContext.ts';
import { canReplaceCard, type CardKind } from '../lib/roll.ts';
import { CardActionButton } from './CardActionButton.tsx';

interface CardActionsProps {
  kind: CardKind;
  slot: number;
  name: string;
  isLocked: boolean;
  className: string;
  onRefuse: () => void;
}

interface ReplaceHints {
  ready: string;
  locked: string;
}

function replaceHint(isLocked: boolean, canReroll: boolean, hints: ReplaceHints): string {
  if (isLocked) {
    return hints.locked;
  }

  return canReroll ? hints.ready : 'Nothing else to re-roll into';
}

export function CardActions({ kind, slot, name, isLocked, className, onRefuse }: CardActionsProps) {
  const canReroll = useRandomizerStore((state) => canReplaceCard(state, kind, slot));
  const rerollCard = useRandomizerStore((state) => state.rerollCard);
  const toggleLock = useRandomizerStore((state) => state.toggleLock);
  const banCard = useRandomizerStore((state) => state.banCard);
  const rerollFocusRef = use(RerollFocusContext);

  const isRerollAvailable = canReroll && !isLocked;

  function replaceWith(event: MouseEvent<HTMLButtonElement>, replace: () => void) {
    if (!isRerollAvailable) {
      onRefuse();

      return;
    }

    // A re-roll remounts the card, so the new card's re-roll button takes the focus
    if (event.currentTarget === document.activeElement) {
      rerollFocusRef.current = slot;
    }

    replace();
  }

  function handleReroll(event: MouseEvent<HTMLButtonElement>) {
    replaceWith(event, () => rerollCard(kind, slot));
  }

  function handleBan(event: MouseEvent<HTMLButtonElement>) {
    replaceWith(event, () => {
      playBan();
      banCard(kind, slot);
    });
  }

  function handleLockToggle() {
    if (isLocked) {
      playUnlock();
    } else {
      playLock();
    }

    toggleLock(kind, slot);
  }

  function takeOverFocus(button: HTMLButtonElement | null) {
    if (button && rerollFocusRef.current === slot) {
      rerollFocusRef.current = null;
      button.focus({ preventScroll: true });
    }
  }

  return (
    <div className={className}>
      <CardActionButton
        ref={takeOverFocus}
        label={`Re-roll ${name}`}
        icon="reroll"
        tooltip={replaceHint(isLocked, canReroll, {
          ready: 'Re-roll',
          locked: 'Unlock to re-roll',
        })}
        aria-disabled={!isRerollAvailable || undefined}
        onClick={handleReroll}
      />
      <CardActionButton
        label={`Lock ${name}`}
        icon={isLocked ? 'lock' : 'unlock'}
        tooltip={isLocked ? 'Unlock' : 'Lock'}
        aria-pressed={isLocked}
        onClick={handleLockToggle}
      />
      <CardActionButton
        label={`Ban ${name}`}
        icon="ban"
        tooltip={replaceHint(isLocked, canReroll, {
          ready: 'Ban and re-roll',
          locked: 'Unlock to ban',
        })}
        aria-disabled={!isRerollAvailable || undefined}
        onClick={handleBan}
      />
    </div>
  );
}
