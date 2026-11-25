import * as Popover from '@radix-ui/react-popover';
import type { ReactNode } from 'react';

import { cn } from '../lib/cn.ts';
import { Icon } from './Icon.tsx';
import { TooltipArrow } from './TooltipArrow.tsx';

interface InfoPopoverProps {
  label: string;
  side: 'top' | 'bottom';
  children: ReactNode;
  className?: string;
}

/** An info button with a popover, not a tooltip, so it also opens on touch screens */
export function InfoPopover({ label, side, children, className }: InfoPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={label}
        className={cn(
          'grid size-[26px] cursor-help place-items-center rounded-full text-[17px] text-gold-300 opacity-75 transition-opacity hover:opacity-100 data-[state=open]:opacity-100 [&>svg]:size-[1em]',
          className,
        )}
      >
        <Icon name="info" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          aria-label={label}
          side={side}
          sideOffset={8}
          collisionPadding={8}
          className="tooltip z-50"
        >
          {children}
          <Popover.Arrow asChild>
            <TooltipArrow />
          </Popover.Arrow>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
