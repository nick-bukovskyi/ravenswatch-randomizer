import { motion } from 'motion/react';
import { useId, useState } from 'react';

import { usePrefersReducedMotion } from '../../../shared/hooks/usePrefersReducedMotion.ts';
import { Icon } from '../../../shared/ui/Icon.tsx';
import type { FaqEntry } from '../data/faq.ts';

interface FaqItemProps {
  entry: FaqEntry;
}

// The answer stays in the HTML while closed, so search engines index it
export function FaqItem({ entry }: FaqItemProps) {
  const panelId = useId();
  const prefersReducedMotion = usePrefersReducedMotion();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-3">
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="group flex w-full cursor-pointer items-center justify-between gap-4 text-left text-xl leading-tight tracking-[0.03em] text-cream-bright transition-colors duration-200 hover:text-gold-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {entry.question}
          <Icon
            name="caret"
            className="size-5 shrink-0 text-gold-500 transition-transform duration-300 ease-game group-aria-expanded:rotate-180"
          />
        </button>
      </h3>
      <motion.div
        id={panelId}
        inert={!isOpen}
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={{
          open: { height: 'auto', opacity: 1 },
          closed: { height: 0, opacity: 0 },
        }}
        transition={{
          height: { duration: prefersReducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.25 },
        }}
        className="overflow-hidden"
      >
        <motion.p
          variants={{ open: { y: 0 }, closed: { y: -6 } }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="pt-3 font-body text-lg leading-relaxed text-cream-muted"
        >
          {entry.answer}
        </motion.p>
      </motion.div>
    </div>
  );
}
