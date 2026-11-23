import * as Popover from '@radix-ui/react-popover';

import { Icon } from '../../../shared/ui/Icon.tsx';
import { TooltipArrow } from '../../../shared/ui/TooltipArrow.tsx';

/** A popover, not a tooltip, so it also opens on touch screens */
export function ScoreInfo() {
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="About the score"
        className="grid size-[26px] cursor-help place-items-center rounded-full text-[17px] text-gold-300 opacity-75 transition-opacity hover:opacity-100 data-[state=open]:opacity-100 [&>svg]:size-[1em]"
      >
        <Icon name="info" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          aria-label="About the score"
          side="top"
          sideOffset={8}
          collisionPadding={8}
          className="tooltip z-50"
        >
          Good modifiers lower your end-of-run score, bad ones raise it. Playing with Modifiers will
          not unlock Difficulties, Achievements or Outfits.
          <Popover.Arrow asChild>
            <TooltipArrow />
          </Popover.Arrow>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
