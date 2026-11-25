import beowulfPortraitBw from '../../../assets/heroes/beowulf-portrait-bw.webp';
import scarletPortraitBw from '../../../assets/heroes/scarlet-portrait-bw.webp';
import theSnowQueenPortraitBw from '../../../assets/heroes/the-snow-queen-portrait-bw.webp';
import { cn } from '../../../shared/lib/cn.ts';
import { PortraitFrame } from '../../../shared/ui/PortraitFrame.tsx';
import { EmptyState } from '../../roll/components/EmptyState.tsx';

interface HeroEmptyStateProps {
  partySize: number;
  shouldAnimateIn: boolean;
}

export function HeroEmptyState({ partySize, shouldAnimateIn }: HeroEmptyStateProps) {
  return (
    <EmptyState
      title="No heroes yet"
      rollLabel="Roll heroes"
      drawText={partySize === 1 ? 'a hero' : `a party of ${partySize}`}
      shouldAnimateIn={shouldAnimateIn}
      // Close to the height of the cards it gives way to; one and two heroes share a size (HeroPanel)
      className={cn(
        partySize <= 2 && 'min-h-[400px]',
        partySize === 1 && 'max-[560px]:min-h-[440px]',
        partySize >= 3 && 'min-h-[560px]',
      )}
    >
      <div className="hero-empty-state__fan">
        <span data-place="left" className="hero-empty-state__card">
          <PortraitFrame className="rounded-[6px]">
            <img src={scarletPortraitBw} alt="" />
          </PortraitFrame>
        </span>
        <span data-place="right" className="hero-empty-state__card">
          <PortraitFrame className="rounded-[6px]">
            <img src={theSnowQueenPortraitBw} alt="" />
          </PortraitFrame>
        </span>
        <span data-place="center" className="hero-empty-state__card">
          <PortraitFrame className="rounded-[6px]">
            <img src={beowulfPortraitBw} alt="" />
          </PortraitFrame>
        </span>
      </div>
    </EmptyState>
  );
}
