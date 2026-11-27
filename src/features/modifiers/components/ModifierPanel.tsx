import { usePrefersReducedMotion } from '../../../shared/hooks/usePrefersReducedMotion.ts';
import { cn } from '../../../shared/lib/cn.ts';
import { formatList, formatScorePercent } from '../../../shared/lib/displayText.ts';
import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import { PoolDialog } from '../../pool/components/PoolDialog.tsx';
import { GroupPanel } from '../../roll/components/GroupPanel.tsx';
import { useGroupReset } from '../../roll/hooks/useGroupReset.ts';
import { useInkReveal } from '../../roll/hooks/useInkReveal.ts';
import { leaveDelayAt, scoreCountAt } from '../../roll/lib/inkTiming.ts';
import { scoreTotalPercent } from '../../roll/lib/roll.ts';
import { modifierById } from '../data/modifiers.ts';
import { ModifierEmptyState } from './ModifierEmptyState.tsx';
import { ModifierRow } from './ModifierRow.tsx';
import { ModifierSettingsChip } from './ModifierSettingsChip.tsx';
import { ScoreTotal } from './ScoreTotal.tsx';

export function ModifierPanel() {
  const modifierIds = useRandomizerStore((state) => state.result.modifierIds);
  const lockedIds = useRandomizerStore((state) => state.locks.modifierIds);
  const rollId = useRandomizerStore((state) => state.modifierRollId);
  const modifierCount = useRandomizerStore((state) => state.settings.modifierCount);
  const shortfall = useRandomizerStore((state) => state.shortfall.modifiers);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { isLeaving, hasShownCards, startReset } = useGroupReset({
    kind: 'modifier',
    rollId,
    cardCount: modifierIds.length,
  });
  const { slots, changeKind, lastDelayMs } = useInkReveal({
    kind: 'modifier',
    ids: modifierIds,
    rollId,
    lockedIds,
    isLeaving,
  });

  const rows = slots.flatMap((slot) => {
    const modifier = modifierById.get(slot.id);

    return modifier ? [{ ...slot, modifier }] : [];
  });
  const scorePercent = scoreTotalPercent(rows.map(({ modifier }) => modifier.id));

  return (
    <GroupPanel
      kind="modifier"
      title="Modifiers"
      chip={<ModifierSettingsChip />}
      bans={<PoolDialog kind="modifier" />}
      bodyClassName={cn(rows.length === 0 && 'min-h-[390px]')}
      onReset={rows.length > 0 ? startReset : undefined}
    >
      {rows.length > 0 ? (
        <>
          <ul className={cn('flex flex-col', isLeaving && 'pointer-events-none')}>
            {rows.map(({ modifier, key, delayMs }, slot) => (
              <ModifierRow
                key={key}
                modifier={modifier}
                slot={slot}
                isLocked={lockedIds.includes(modifier.id)}
                isLeaving={isLeaving}
                delayMs={delayMs}
                leaveDelayMs={leaveDelayAt('modifier', slot, rows.length)}
              />
            ))}
          </ul>
          <ScoreTotal
            percent={scorePercent}
            countAtMs={scoreCountAt({ changeKind, lastDelayMs, prefersReducedMotion })}
          />
          {shortfall > 0 && (
            <p className="mt-4 pl-2.5 font-body text-base text-cream-muted">
              Only {rows.length} of {rows.length + shortfall} modifiers could be rolled. Bans and
              exclusions left too few choices.
            </p>
          )}
        </>
      ) : (
        <ModifierEmptyState modifierCount={modifierCount} shouldAnimateIn={hasShownCards} />
      )}
      <p role="status" className="sr-only">
        {rows.length > 0 &&
          `Modifiers: ${formatList(rows.map(({ modifier }) => modifier.name))}. Score ${formatScorePercent(scorePercent)}.`}
      </p>
    </GroupPanel>
  );
}
