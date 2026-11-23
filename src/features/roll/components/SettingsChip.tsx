import * as Popover from '@radix-ui/react-popover';
import type { ReactNode } from 'react';

import { useFocusContentOnOpen } from '../../../shared/hooks/useFocusContentOnOpen.ts';
import { cn } from '../../../shared/lib/cn.ts';
import { Icon } from '../../../shared/ui/Icon.tsx';

interface SettingsChipProps {
  label: string;
  summary: ReactNode;
  children: ReactNode;
  align: 'start' | 'end';
  icon?: ReactNode;
  className?: string;
}

export function SettingsChip({
  label,
  summary,
  children,
  align,
  icon,
  className,
}: SettingsChipProps) {
  const { contentRef, handleOpenAutoFocus } = useFocusContentOnOpen();

  return (
    <Popover.Root>
      <Popover.Trigger className="inline-flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded-full bg-white/7.5 pt-0.5 pr-2.5 pl-3 text-base tracking-[0.03em] whitespace-nowrap text-cream transition-colors duration-200 hover:bg-white/14 data-[state=open]:bg-white/14">
        {icon}
        <span className="sr-only">{label}: </span>
        {summary}
        <Icon name="caret" className="-mt-0.5 size-3.5 text-gold-300" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          ref={contentRef}
          aria-label={label}
          align={align}
          sideOffset={10}
          collisionPadding={14}
          className={cn(
            'settings-chip__popover z-40 flex flex-col gap-3.5 rounded-[14px] bg-panel-raised p-3.5 shadow-[0_22px_50px_-8px_#000,0_0_0_1px_--alpha(var(--color-gold-300)/12%)] outline-none',
            className,
          )}
          onOpenAutoFocus={handleOpenAutoFocus}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
