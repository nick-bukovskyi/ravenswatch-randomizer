import type { ComponentPropsWithRef } from 'react';

import { cn } from '../lib/cn.ts';
import { Icon, type IconName } from './Icon.tsx';
import { Tooltip } from './Tooltip.tsx';

interface ToolButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'aria-label'> {
  label: string;
  icon: IconName;
  tooltip?: string;
}

export function ToolButton({
  label,
  icon,
  tooltip,
  children,
  className,
  type = 'button',
  ...props
}: ToolButtonProps) {
  return (
    <Tooltip content={tooltip ?? label}>
      <button
        type={type}
        aria-label={label}
        className={cn(
          'relative grid size-[38px] shrink-0 cursor-pointer place-items-center rounded-full text-[19px] text-gold-300 opacity-80 transition-[background-color,opacity] duration-200 hover:bg-white/7 hover:opacity-100 aria-pressed:opacity-100 [&>svg]:size-[1em]',
          className,
        )}
        {...props}
      >
        <Icon name={icon} />
        {children}
      </button>
    </Tooltip>
  );
}
