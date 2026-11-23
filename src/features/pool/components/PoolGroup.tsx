import { motion } from 'motion/react';
import { useId, type ComponentProps, type ReactNode } from 'react';

import { STAGGER_LIST_VARIANTS } from '../../../shared/lib/staggerMotion.ts';
import { PoolGroupHeading } from './PoolGroupHeading.tsx';

interface PoolGroupProps {
  title: string;
  available: number;
  total: number;
  tone: ComponentProps<typeof PoolGroupHeading>['tone'];
  listClassName: string;
  children: ReactNode;
}

export function PoolGroup({
  title,
  available,
  total,
  tone,
  listClassName,
  children,
}: PoolGroupProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId}>
      <PoolGroupHeading
        id={headingId}
        title={title}
        available={available}
        total={total}
        tone={tone}
      />
      <motion.ul
        className={listClassName}
        variants={STAGGER_LIST_VARIANTS}
        initial="hidden"
        animate="shown"
      >
        {children}
      </motion.ul>
    </section>
  );
}
