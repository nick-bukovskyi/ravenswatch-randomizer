import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

import { usePrefersReducedMotion } from '../../../shared/hooks/usePrefersReducedMotion.ts';
import { formatScorePercent } from '../../../shared/lib/displayText.ts';
import { emitRollEvent } from '../../roll/lib/rollEvents.ts';
import { ScoreInfo } from './ScoreInfo.tsx';

const COUNT_SECONDS = 0.6;
/** Count progress at each tick; the last one lands with the number */
const TICK_PROGRESS = [0.25, 0.5, 0.75, 1] as const;

interface ScoreTotalProps {
  percent: number;
  countAtMs: number | null;
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

      if (countAtMs === null) {
        counter.percent = percent;
        writeCount();

        return;
      }

      const countSeconds = prefersReducedMotion ? 0 : COUNT_SECONDS;
      const ticks = prefersReducedMotion ? [1] : TICK_PROGRESS;

      writeCount();
      gsap.to(counter, {
        percent,
        delay: countAtMs / 1000,
        duration: countSeconds,
        ease: 'power2.out',
        onUpdate: writeCount,
      });

      // power2.out is cubic: progress p comes at 1 - cbrt(1 - p), so each tick lands as the number does
      ticks.forEach((progress, tick) => {
        gsap.delayedCall(countAtMs / 1000 + countSeconds * (1 - Math.cbrt(1 - progress)), () =>
          emitRollEvent('scoreTick', { tick }),
        );
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
