import type { Variants } from 'motion/react';

export const STAGGER_LIST_VARIANTS: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.025, delayChildren: 0.12 } },
};

export const STAGGER_ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 10 },
  shown: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 420, damping: 32 } },
};
