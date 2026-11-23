import { useId, useRef, type MouseEvent, type ReactNode } from 'react';

import { Icon } from '../../../shared/ui/Icon.tsx';
import { Tooltip } from '../../../shared/ui/Tooltip.tsx';
import { playUiClick } from '../../sound/lib/soundEffects.ts';
import { RerollFocusContext } from '../lib/rerollFocusContext.ts';
import type { CardKind } from '../lib/roll.ts';
import { RollButton } from './RollButton.tsx';

interface GroupPanelProps {
  kind: CardKind;
  title: string;
  chip: ReactNode;
  children: ReactNode;
  onReset?: () => void;
}

export function GroupPanel({ kind, title, chip, children, onReset }: GroupPanelProps) {
  const headingId = useId();

  const rollButtonRef = useRef<HTMLButtonElement>(null);
  const rerollFocusRef = useRef<number | null>(null);

  function handleReset(event: MouseEvent<HTMLButtonElement>) {
    playUiClick();

    // The reset button unmounts with the cards, so the focus moves to Roll
    if (event.currentTarget === document.activeElement) {
      rollButtonRef.current?.focus({ preventScroll: true });
    }

    onReset?.();
  }

  return (
    <section aria-labelledby={headingId} className="group-panel">
      <div className="relative mb-[26px] flex items-center gap-3 max-[560px]:flex-wrap">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <h2
            id={headingId}
            className="pt-[3px] text-[26px] leading-none tracking-[0.06em] text-cream-bright uppercase text-engraved"
          >
            {title}
          </h2>
          {onReset && (
            <Tooltip content="Reset">
              <button
                type="button"
                aria-label={`Reset ${title.toLowerCase()}`}
                className="grid size-[30px] cursor-pointer place-items-center rounded-full text-base text-cream-muted opacity-65 transition-[background-color,opacity,color] duration-200 hover:bg-white/9 hover:text-cream-bright hover:opacity-100 [&>svg]:size-[1em]"
                onClick={handleReset}
              >
                <Icon name="reset" />
              </button>
            </Tooltip>
          )}
        </div>
        {chip}
        <RollButton ref={rollButtonRef} kind={kind} />
      </div>
      <RerollFocusContext value={rerollFocusRef}>{children}</RerollFocusContext>
    </section>
  );
}
