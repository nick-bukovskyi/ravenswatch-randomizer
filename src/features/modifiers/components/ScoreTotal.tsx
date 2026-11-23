import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

import { usePrefersReducedMotion } from '../../../shared/hooks/usePrefersReducedMotion.ts';
import { formatScorePercent } from '../../../shared/lib/displayText.ts';
import { ScoreInfo } from './ScoreInfo.tsx';

const COUNT_SECONDS = 0.6;

interface ScoreTotalProps {
  percent: number;
  countAtMs: number;
}

export function ScoreTotal({ percent, countAtMs }: ScoreTotalProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const valueRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const element = valueRef.current;

      if (!element) {
        return;
      }

      // Start from the shown number so an interrupted count continues from it
      const counter = { percent: Number(element.dataset.percent ?? 0) };

      const writeCount = () => {
        element.textContent = formatScorePercent(Math.round(counter.percent));
        element.dataset.percent = String(counter.percent);
      };

      writeCount();
      gsap.to(counter, {
        percent,
        delay: countAtMs / 1000,
        duration: prefersReducedMotion ? 0 : COUNT_SECONDS,
        ease: 'power2.out',
        onUpdate: writeCount,
      });
    },
    { dependencies: [percent, countAtMs, prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <div className="mt-3.5 flex items-center gap-1.5 pl-2.5 text-[17px] text-cream-muted">
      Score
      {/* GSAP writes the number; React leaves this element empty */}
      <b
        ref={valueRef}
        className="min-w-[3.4ch] text-[22px] font-normal text-cream-bright tabular-nums"
      />
      <ScoreInfo />
    </div>
  );
}
