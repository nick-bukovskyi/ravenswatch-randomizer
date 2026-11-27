import beowulfPortraitBw from '../../../assets/heroes/beowulf-portrait-bw.webp';
import scarletPortraitBw from '../../../assets/heroes/scarlet-portrait-bw.webp';
import theSnowQueenPortraitBw from '../../../assets/heroes/the-snow-queen-portrait-bw.webp';
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
    >
      <div className="hero-empty-state__fan">
        <span data-place="left" className="hero-empty-state__card">
          <PortraitFrame className="rounded-[6px]">
            <img src={scarletPortraitBw} alt="Scarlet" />
          </PortraitFrame>
        </span>
        <span data-place="right" className="hero-empty-state__card">
          <PortraitFrame className="rounded-[6px]">
            <img src={theSnowQueenPortraitBw} alt="The Snow Queen" />
          </PortraitFrame>
        </span>
        <span data-place="center" className="hero-empty-state__card">
          <PortraitFrame className="rounded-[6px]">
            <img src={beowulfPortraitBw} alt="Beowulf" />
          </PortraitFrame>
        </span>
      </div>
    </EmptyState>
  );
}
