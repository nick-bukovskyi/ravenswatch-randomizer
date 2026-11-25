import { useId } from 'react';

/**
 * Pirata One "R" (OFL) outlined from the font: units of 1000, y up, ink box x -10..437,
 * y -32..768. public/favicon.svg uses the same path
 */
const STORYBOOK_R_PATH =
  'M209 672Q191 672 170 657V332Q196 332 228 348.5Q260 365 260 383V598Q260 672 209 672ZM50 102V620Q50 681 9 689V711L110 768Q130 760 150 739Q170 718 170 701Q280 768 296 768Q312 768 346.5 727Q381 686 381 653V372Q381 364 272 321Q318 166 380 112Q408 89 437 89V59Q344 0 319 0Q286 0 235.5 124Q185 248 181 288L170 285V154Q170 117 178 101Q186 85 211 85V54L6 -32L-10 0Q12 0 32 26Q50 51 50 102Z';

export function StorybookCap() {
  const gradientId = useId();

  return (
    <svg viewBox="-10 -768 447 800" className="storybook-cap">
      <defs>
        {/* Bottom to top because the path is flipped */}
        <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--color-gold-100)' }} />
          <stop offset="0.5" style={{ stopColor: 'var(--color-gold-500)' }} />
          <stop offset="1" style={{ stopColor: 'var(--color-gold-700)' }} />
        </linearGradient>
      </defs>
      <path transform="scale(1 -1)" d={STORYBOOK_R_PATH} fill={`url(#${gradientId})`} />
    </svg>
  );
}
