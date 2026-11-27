import corruptionIcon from '../../../assets/modifiers/corruption.webp';
import eternalSunIcon from '../../../assets/modifiers/eternal-sun.webp';
import quickLearnerIcon from '../../../assets/modifiers/quick-learner.webp';
import { EmptyState } from '../../roll/components/EmptyState.tsx';
import { IconTile } from './IconTile.tsx';

interface ModifierEmptyStateProps {
  modifierCount: number;
  shouldAnimateIn: boolean;
}

export function ModifierEmptyState({ modifierCount, shouldAnimateIn }: ModifierEmptyStateProps) {
  return (
    <EmptyState
      title="No modifiers yet"
      rollLabel="Roll modifiers"
      drawText={modifierCount === 1 ? 'a modifier' : `${modifierCount} modifiers`}
      shouldAnimateIn={shouldAnimateIn}
    >
      <div className="modifier-empty-state__hand">
        <span data-place="left" className="modifier-empty-state__tile">
          <IconTile icon={quickLearnerIcon} polarity="good" />
        </span>
        <span data-place="right" className="modifier-empty-state__tile">
          <IconTile icon={eternalSunIcon} polarity="good" />
        </span>
        <span data-place="center" className="modifier-empty-state__tile">
          <IconTile icon={corruptionIcon} polarity="bad" />
        </span>
      </div>
    </EmptyState>
  );
}
