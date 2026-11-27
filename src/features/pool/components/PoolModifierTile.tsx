import { AnimatePresence, motion } from 'motion/react';
import { useId } from 'react';

import { formatScorePercent } from '../../../shared/lib/displayText.ts';
import { STAGGER_ITEM_VARIANTS } from '../../../shared/lib/staggerMotion.ts';
import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import { playBan, playUnban } from '../../sound/lib/soundEffects.ts';
import { IconTile } from '../../modifiers/components/IconTile.tsx';
import type { Modifier } from '../../modifiers/data/modifiers.ts';
import { useBanGesture } from '../hooks/useBanGesture.ts';
import { BanSeal } from './BanSeal.tsx';
import { PoolTileHint } from './PoolTileHint.tsx';
import { PoolTileName } from './PoolTileName.tsx';

interface PoolModifierTileProps {
  modifier: Modifier;
}

export function PoolModifierTile({ modifier }: PoolModifierTileProps) {
  const isBanned = useRandomizerStore((state) => state.bans.modifierIds.includes(modifier.id));
  const toggleModifierBan = useRandomizerStore((state) => state.toggleModifierBan);
  const descriptionId = useId();

  function handleToggle() {
    if (isBanned) {
      playUnban();
    } else {
      playBan();
    }

    toggleModifierBan(modifier.id);
  }

  const banGesture = useBanGesture(handleToggle);

  return (
    <motion.li variants={STAGGER_ITEM_VARIANTS}>
      <button
        type="button"
        aria-label={`Ban ${modifier.name}`}
        aria-describedby={descriptionId}
        aria-pressed={isBanned}
        className="pool-tile group/tile relative flex w-full items-center gap-3 rounded-[10px] border border-white/6 bg-white/3 p-2 pr-3 text-left transition-[border-color,background-color,box-shadow] duration-300 hover:border-gold-700 hover:shadow-[0_0_16px_-6px_--alpha(var(--color-gold-300)/50%)] aria-pressed:border-crimson-700/70 aria-pressed:bg-night-deep/70"
        {...banGesture}
      >
        <span className="relative w-12 shrink-0 p-[3px] sm:w-14">
          <IconTile
            icon={modifier.icon}
            polarity={modifier.polarity}
            className="w-full transition-[filter] duration-500 group-aria-pressed/tile:brightness-50 group-aria-pressed/tile:grayscale"
          />
          <AnimatePresence initial={false}>
            {isBanned && <BanSeal key="seal" className="-right-[14%] -bottom-[14%] w-[64%]" />}
          </AnimatePresence>
          <PoolTileHint isBanned={isBanned} className="-top-1.5 left-1/2 -translate-x-1/2" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <PoolTileName
              name={modifier.name}
              className="text-lg leading-tight text-cream-bright transition-colors duration-300 text-engraved group-aria-pressed/tile:text-cream-muted"
            />
            <span
              data-polarity={modifier.polarity}
              className="modifier-score shrink-0 text-sm tracking-wide whitespace-nowrap transition-opacity duration-300 group-aria-pressed/tile:opacity-50"
            >
              Score {formatScorePercent(modifier.scorePercent)}
            </span>
          </span>
          <span
            id={descriptionId}
            className="mt-0.5 block font-body text-sm leading-snug text-cream-muted transition-opacity duration-300 group-aria-pressed/tile:opacity-60"
          >
            {modifier.description}
          </span>
        </span>
      </button>
    </motion.li>
  );
}
