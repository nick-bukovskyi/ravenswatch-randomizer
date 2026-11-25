import { cn } from '../../../shared/lib/cn.ts';
import { formatList } from '../../../shared/lib/displayText.ts';
import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import { GroupPanel } from '../../roll/components/GroupPanel.tsx';
import { useGroupReset } from '../../roll/hooks/useGroupReset.ts';
import { useInkReveal } from '../../roll/hooks/useInkReveal.ts';
import { leaveDelayAt } from '../../roll/lib/inkTiming.ts';
import { heroById } from '../data/heroes.ts';
import { HeroCard } from './HeroCard.tsx';
import { HeroEmptyState } from './HeroEmptyState.tsx';
import { PartySizeChip } from './PartySizeChip.tsx';

export function HeroPanel() {
  const heroIds = useRandomizerStore((state) => state.result.heroIds);
  const lockedIds = useRandomizerStore((state) => state.locks.heroIds);
  const rollId = useRandomizerStore((state) => state.heroRollId);
  const partySize = useRandomizerStore((state) => state.settings.partySize);
  const shortfall = useRandomizerStore((state) => state.shortfall.heroes);

  const { isLeaving, hasShownCards, startReset } = useGroupReset({
    kind: 'hero',
    rollId,
    cardCount: heroIds.length,
  });
  const { slots } = useInkReveal({ kind: 'hero', ids: heroIds, rollId, lockedIds, isLeaving });

  const party = slots.flatMap((slot) => {
    const hero = heroById.get(slot.id);

    return hero ? [{ ...slot, hero }] : [];
  });

  return (
    <GroupPanel
      kind="hero"
      title="Heroes"
      chip={<PartySizeChip />}
      onReset={party.length > 0 ? startReset : undefined}
    >
      {party.length > 0 ? (
        <>
          {/* One hero takes the two-hero size, so the panel keeps its height; phones show it larger */}
          <ul
            className={cn(
              'flex flex-wrap justify-center gap-x-4 gap-y-[18px]',
              party.length <= 2 && '[--hero-width:min(250px,calc(50%_-_8px))]',
              party.length === 1 && 'max-[560px]:[--hero-width:min(100%,280px)]',
              party.length >= 3 && '[--hero-width:min(215px,calc(50%_-_8px))]',
              isLeaving && 'pointer-events-none',
            )}
          >
            {party.map(({ hero, key, delayMs }, slot) => (
              <HeroCard
                key={key}
                hero={hero}
                slot={slot}
                isLocked={lockedIds.includes(hero.id)}
                isLeaving={isLeaving}
                delayMs={delayMs}
                leaveDelayMs={leaveDelayAt('hero', slot, party.length)}
              />
            ))}
          </ul>
          {shortfall > 0 && (
            <p className="mt-5 text-center font-body text-base text-cream-muted">
              Only {party.length} of {party.length + shortfall} heroes could be rolled. Bans left
              too few choices.
            </p>
          )}
        </>
      ) : (
        <HeroEmptyState partySize={partySize} shouldAnimateIn={hasShownCards} />
      )}
      <p role="status" className="sr-only">
        {party.length > 0 && `Party: ${formatList(party.map(({ hero }) => hero.name))}`}
      </p>
    </GroupPanel>
  );
}
