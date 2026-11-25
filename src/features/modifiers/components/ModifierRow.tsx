import { formatScorePercent } from '../../../shared/lib/displayText.ts';
import { Icon } from '../../../shared/ui/Icon.tsx';
import { CardActions } from '../../roll/components/CardActions.tsx';
import { useRefusalShake } from '../../roll/hooks/useRefusalShake.ts';
import { useTouchSelection } from '../../roll/hooks/useTouchSelection.ts';
import { inkState } from '../../roll/lib/inkTiming.ts';
import type { Modifier } from '../data/modifiers.ts';
import { IconTile } from './IconTile.tsx';

interface ModifierRowProps {
  modifier: Modifier;
  slot: number;
  isLocked: boolean;
  isLeaving: boolean;
  delayMs: number | null;
  leaveDelayMs: number;
}

export function ModifierRow({
  modifier,
  slot,
  isLocked,
  isLeaving,
  delayMs,
  leaveDelayMs,
}: ModifierRowProps) {
  const { ref, isSelected, onClick } = useTouchSelection<HTMLLIElement>();
  const { isShaking, shake } = useRefusalShake();

  return (
    <li
      ref={ref}
      data-ink={inkState(isLeaving, delayMs)}
      data-selected={isSelected}
      data-shaking={isShaking}
      className="modifier-row"
      style={{ '--ink-delay': `${delayMs ?? 0}ms`, '--ink-leave-delay': `${leaveDelayMs}ms` }}
      onClick={onClick}
    >
      <div className="modifier-row__main">
        <span className="modifier-row__tile-wrap">
          <IconTile icon={modifier.icon} polarity={modifier.polarity} className="w-full" />
          <span aria-hidden="true" className="modifier-row__ring" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="modifier-row__name flex items-center gap-2 text-xl leading-[1.15]">
            {modifier.name}
            {isLocked && (
              <span className="grid shrink-0 text-[13px] text-gold-300">
                <Icon name="lock" className="size-[1em]" />
                <span className="sr-only">Locked</span>
              </span>
            )}
          </h3>
          <p className="modifier-row__description mt-[3px] font-body text-[15.5px] leading-[1.28] text-cream-muted">
            {modifier.description}
          </p>
        </div>
        <p
          data-polarity={modifier.polarity}
          className="modifier-row__score modifier-score min-w-11 shrink-0 text-right text-lg tracking-[0.02em]"
        >
          <span className="sr-only">Score </span>
          {formatScorePercent(modifier.scorePercent)}
        </p>
      </div>
      <CardActions
        kind="modifier"
        slot={slot}
        name={modifier.name}
        isLocked={isLocked}
        className="modifier-row__actions"
        onRefuse={shake}
      />
    </li>
  );
}
