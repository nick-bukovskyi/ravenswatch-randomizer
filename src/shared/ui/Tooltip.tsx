import * as RadixTooltip from '@radix-ui/react-tooltip';
import type { ReactElement, ReactNode } from 'react';

import { TooltipArrow } from './TooltipArrow.tsx';

interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
}

/** Radix tooltips do not open on touch, so never put essential information only here */
export function Tooltip({ content, children }: TooltipProps) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side="top"
          sideOffset={8}
          collisionPadding={8}
          className="tooltip z-50"
        >
          {content}
          <RadixTooltip.Arrow asChild>
            <TooltipArrow />
          </RadixTooltip.Arrow>
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
