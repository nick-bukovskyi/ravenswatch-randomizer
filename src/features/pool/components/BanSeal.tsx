import { motion } from 'motion/react';
import { useId } from 'react';

import { cn } from '../../../shared/lib/cn.ts';

interface BanSealProps {
  className?: string;
}

const SCALLOPS = 14;
const WAX_PATH = buildScallopedCircle({ center: 50, inner: 41, outer: 51, count: SCALLOPS });

function buildScallopedCircle({
  center,
  inner,
  outer,
  count,
}: {
  center: number;
  inner: number;
  outer: number;
  count: number;
}): string {
  const step = (Math.PI * 2) / count;

  const point = (radius: number, angle: number) =>
    `${(center + radius * Math.cos(angle)).toFixed(2)} ${(center + radius * Math.sin(angle)).toFixed(2)}`;

  const curves = Array.from(
    { length: count },
    (_, index) => `Q${point(outer, (index + 0.5) * step)} ${point(inner, (index + 1) * step)}`,
  );

  return `M${point(inner, 0)} ${curves.join(' ')}Z`;
}

export function BanSeal({ className }: BanSealProps) {
  const id = useId();

  return (
    <motion.span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute grid aspect-square place-items-center',
        className,
      )}
      initial={{ opacity: 0, scale: 2.1, rotate: -32 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: -14,
        transition: { type: 'spring', stiffness: 640, damping: 19, mass: 0.9 },
      }}
      exit={{
        opacity: 0,
        scale: 1.35,
        rotate: -4,
        transition: { duration: 0.22, ease: 'easeOut' },
      }}
    >
      <motion.span
        className="ban-seal__dust absolute inset-0 rounded-full"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: [0, 0.75, 0], scale: [0.7, 0.9, 1.75] }}
        transition={{ duration: 0.55, times: [0, 0.3, 1], ease: 'easeOut', delay: 0.06 }}
      />
      <svg viewBox="0 0 100 100" className="ban-seal relative size-full">
        <defs>
          <radialGradient id={`${id}-wax`} cx="0.38" cy="0.32" r="0.75">
            <stop offset="0" stopColor="#e2414b" />
            <stop offset="0.45" style={{ stopColor: 'var(--color-crimson-500)' }} />
            <stop offset="1" stopColor="#4d080e" />
          </radialGradient>
        </defs>
        <path
          d={WAX_PATH}
          fill={`url(#${id}-wax)`}
          strokeWidth="1.5"
          className="stroke-crimson-900"
        />
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          strokeOpacity="0.55"
          className="stroke-crimson-900"
          strokeWidth="2.5"
        />
        <circle
          cx="50"
          cy="51.2"
          r="30"
          fill="none"
          stroke="#ffb4aa"
          strokeOpacity="0.22"
          strokeWidth="1.2"
        />
        <g fill="none" strokeLinecap="round" strokeWidth="6">
          <g stroke="#ffb4aa" strokeOpacity="0.25" transform="translate(0 1.4)">
            <circle cx="50" cy="50" r="17" />
            <path d="M38 38l24 24" />
          </g>
          <g strokeOpacity="0.85" className="stroke-crimson-900">
            <circle cx="50" cy="50" r="17" />
            <path d="M38 38l24 24" />
          </g>
        </g>
        <ellipse
          cx="38"
          cy="30"
          rx="14"
          ry="7"
          fill="#fff"
          fillOpacity="0.14"
          transform="rotate(-30 38 30)"
        />
      </svg>
    </motion.span>
  );
}
