import type { ComponentPropsWithRef } from 'react';

/** Use as the `asChild` child of a Radix `Arrow`, which places and rotates it */
export function TooltipArrow(props: ComponentPropsWithRef<'svg'>) {
  return (
    <svg {...props} width={14} height={7} viewBox="0 0 14 7" className="tooltip__arrow">
      <path d="M0 0 7 7 14 0" />
    </svg>
  );
}
