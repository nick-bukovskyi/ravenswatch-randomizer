import { AnimatePresence, motion } from 'motion/react';

interface BanCountBadgeProps {
  count: number;
}

export function BanCountBadge({ count }: BanCountBadgeProps) {
  return (
    <AnimatePresence initial={false}>
      {count > 0 && (
        <motion.span
          key="badge"
          className="absolute top-0 right-0 grid h-4 min-w-4 place-items-center rounded-full bg-crimson-500 px-1 pt-px font-display text-[11px] leading-none text-cream-bright tabular-nums shadow-[0_0_0_1.5px_var(--color-night),0_2px_6px_rgb(0_0_0/0.7)]"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 600, damping: 22 }}
        >
          <motion.span
            key={count}
            initial={{ scale: 1.6 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 600, damping: 18 }}
          >
            {count}
          </motion.span>
          <span className="sr-only"> banned</span>
        </motion.span>
      )}
    </AnimatePresence>
  );
}
