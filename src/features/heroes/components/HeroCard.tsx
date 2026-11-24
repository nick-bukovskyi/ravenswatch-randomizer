import { toDisplayName } from '../../../shared/lib/displayText.ts';
import { Icon } from '../../../shared/ui/Icon.tsx';
import { PortraitFrame } from '../../../shared/ui/PortraitFrame.tsx';
import { CardActions } from '../../roll/components/CardActions.tsx';
import { useRefusalShake } from '../../roll/hooks/useRefusalShake.ts';
import { useTouchSelection } from '../../roll/hooks/useTouchSelection.ts';
import type { Hero } from '../data/heroes.ts';

interface HeroCardProps {
  hero: Hero;
  slot: number;
  isLocked: boolean;
  isLeaving: boolean;
  delayMs: number;
  leaveDelayMs: number;
}

export function HeroCard({
  hero,
  slot,
  isLocked,
  isLeaving,
  delayMs,
  leaveDelayMs,
}: HeroCardProps) {
  const { ref, isSelected, onClick } = useTouchSelection<HTMLLIElement>();
  const { isShaking, shake } = useRefusalShake();

  return (
    <li
      ref={ref}
      data-ink={isLeaving ? 'out' : 'in'}
      data-selected={isSelected}
      data-shaking={isShaking}
      className="hero-card"
      style={{ '--ink-delay': `${delayMs}ms`, '--ink-leave-delay': `${leaveDelayMs}ms` }}
      onClick={onClick}
    >
      <div className="hero-card__body">
        <div className="hero-card__lift">
          <div className="hero-card__frame">
            <div className="hero-card__inner">
              <div className="hero-card__art">
                {/* The art is about 370px wide at most, so 1x screens get the small file */}
                <img
                  src={hero.illustration}
                  srcSet={`${hero.illustrationSmall} 480w, ${hero.illustration} 800w`}
                  sizes="(max-width: 560px) 85vw, 370px"
                  alt=""
                  decoding="async"
                  style={{
                    '--art-x': hero.artFocus.x,
                    '--art-y': hero.artFocus.y,
                    '--art-zoom': hero.artFocus.zoom,
                  }}
                />
              </div>
              <div className="hero-card__foot">
                <div className="hero-card__portrait-wrap">
                  <PortraitFrame>
                    <img src={hero.portrait} alt="" />
                  </PortraitFrame>
                  <span aria-hidden="true" className="hero-card__ring" />
                </div>
                <div className="hero-card__banner-wrap">
                  <div className="hero-card__banner">
                    <h3 className="hero-card__name">{toDisplayName(hero.name)}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLocked && (
          <span aria-hidden="true" className="hero-card__lock">
            <Icon name="lock" className="size-[1em]" />
          </span>
        )}
        <CardActions
          kind="hero"
          slot={slot}
          name={hero.name}
          isLocked={isLocked}
          className="hero-card__actions"
          onRefuse={shake}
        />
      </div>
    </li>
  );
}
