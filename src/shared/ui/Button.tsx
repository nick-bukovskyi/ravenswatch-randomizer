import type { ComponentPropsWithRef } from 'react';

import { cn } from '../lib/cn.ts';
import { ShapeLayers } from './ShapeLayers.tsx';

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md';
}

export function Button({
  children,
  className,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-tone={variant === 'primary' ? 'crimson' : 'dark'}
      className={cn(
        'shape-layers button inline-flex shrink-0 items-center justify-center gap-2 pt-[0.1em] font-display leading-none tracking-wide uppercase text-engraved',
        variant === 'primary' ? 'text-cream-bright' : 'text-gold-300',
        size === 'sm' && 'h-9 px-6 text-base [--chev:0.625rem]',
        size === 'md' && 'h-12 px-8 text-xl [--chev:0.875rem]',
        className,
      )}
      {...props}
    >
      <ShapeLayers />
      {children}
    </button>
  );
}
