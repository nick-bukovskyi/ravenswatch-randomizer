import { AnimatePresence, motion, useAnimate } from 'motion/react';

import { usePrefersReducedMotion } from '../../../shared/hooks/usePrefersReducedMotion.ts';
import { toDisplayName } from '../../../shared/lib/displayText.ts';
import { STAGGER_ITEM_VARIANTS } from '../../../shared/lib/staggerMotion.ts';
import { PortraitFrame } from '../../../shared/ui/PortraitFrame.tsx';
import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import { playBan, playRefusal, playUnban } from '../../sound/lib/soundEffects.ts';
import type { Hero } from '../../heroes/data/heroes.ts';
import { useBanGesture } from '../hooks/useBanGesture.ts';
import { BanSeal } from './BanSeal.tsx';
import { PoolTileHint } from './PoolTileHint.tsx';

interface PoolHeroTileProps {
  hero: Hero;
  onLastHeroRefused: () => void;
}

export function PoolHeroTile({ hero, onLastHeroRefused }: PoolHeroTileProps) {
  const isBanned = useRandomizerStore((state) => state.bans.heroIds.includes(hero.id));
  const toggleHeroBan = useRandomizerStore((state) => state.toggleHeroBan);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [shakeScope, animate] = useAnimate<HTMLSpanElement>();

  function handleToggle() {
    if (toggleHeroBan(hero.id)) {
      if (isBanned) {
        playUnban();
      } else {
        playBan();
      }

      return;
    }

    playRefusal();
    onLastHeroRefused();

    if (!prefersReducedMotion) {
      animate(shakeScope.current, { x: [0, -7, 6, -4, 3, 0] }, { duration: 0.42 });
    }
  }

  const banGesture = useBanGesture(handleToggle);

  return (
    <motion.li variants={STAGGER_ITEM_VARIANTS}>
      <button
        type="button"
        aria-label={`Ban ${hero.name}`}
        aria-pressed={isBanned}
        className="pool-tile group/tile block w-full rounded-md p-1 text-center"
        {...banGesture}
      >
        <span ref={shakeScope} className="relative block">
          <PortraitFrame className="w-full transition-[filter,box-shadow] duration-500 group-hover/tile:shadow-[0_0_0_1px_var(--color-gold-300),0_0_18px_--alpha(var(--color-gold-300)/45%)] group-aria-pressed/tile:brightness-90 group-aria-pressed/tile:grayscale-[0.6]">
            <span className="absolute inset-0 bg-radial-[circle_at_50%_30%] from-panel-raised to-panel-deep to-75%" />
            <img
              src={hero.portraitBw}
              alt=""
              draggable={false}
              className="absolute inset-0 size-full object-cover"
            />
            <img
              src={hero.portrait}
              alt=""
              draggable={false}
              className="absolute inset-0 size-full object-cover transition-opacity duration-500 group-aria-pressed/tile:opacity-0"
            />
          </PortraitFrame>
          <AnimatePresence initial={false}>
            {isBanned && <BanSeal key="seal" className="right-[3%] bottom-[3%] w-[52%]" />}
          </AnimatePresence>
          <PoolTileHint isBanned={isBanned} className="top-1.5 left-1/2 -translate-x-1/2" />
        </span>
        <span className="mt-1.5 block text-sm leading-tight text-cream-bright decoration-crimson-300/80 decoration-2 transition-colors duration-300 text-engraved group-aria-pressed/tile:text-cream-muted group-aria-pressed/tile:line-through sm:text-base">
          {toDisplayName(hero.name)}
        </span>
      </button>
    </motion.li>
  );
}
