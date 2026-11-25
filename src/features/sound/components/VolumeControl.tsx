import * as Popover from '@radix-ui/react-popover';
import type { ChangeEvent } from 'react';

import { ToolButton } from '../../../shared/ui/ToolButton.tsx';
import { TooltipArrow } from '../../../shared/ui/TooltipArrow.tsx';
import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import { playVolumePreview } from '../lib/soundEffects.ts';

const STEP_PERCENT = 5;

/** A popover, not a tooltip, so it also opens on touch screens */
export function VolumeControl() {
  const volume = useRandomizerStore((state) => state.volume);
  const setVolume = useRandomizerStore((state) => state.setVolume);

  const percent = Math.round(volume * 100);
  const isMuted = percent === 0;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setVolume(Number(event.target.value) / 100);
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <ToolButton
          label="Sound volume"
          icon={volumeIcon(percent)}
          tooltip={isMuted ? 'Sound off' : `Sound ${percent}%`}
          className="data-[state=open]:bg-white/7 data-[state=open]:opacity-100"
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          aria-label="Sound volume"
          side="bottom"
          align="end"
          sideOffset={8}
          collisionPadding={8}
          className="tooltip z-50 w-[230px] px-4 pt-3 pb-4"
        >
          <div className="mb-2.5 flex items-baseline justify-between font-display">
            <span className="text-[15px] tracking-[0.06em] text-cream-bright uppercase text-engraved">
              Volume
            </span>
            <span className="text-[15px] text-gold-300 tabular-nums">
              {isMuted ? 'Muted' : `${percent}%`}
            </span>
          </div>
          {/* Plays a click on release, so the new level can be heard */}
          <input
            type="range"
            min={0}
            max={100}
            step={STEP_PERCENT}
            value={percent}
            aria-label="Volume"
            aria-valuetext={isMuted ? 'Muted' : `${percent}%`}
            className="volume-slider"
            style={{ '--volume': `${percent}%` }}
            onChange={handleChange}
            onPointerUp={playVolumePreview}
            onKeyUp={playVolumePreview}
          />
          <Popover.Arrow asChild>
            <TooltipArrow />
          </Popover.Arrow>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function volumeIcon(percent: number) {
  if (percent === 0) {
    return 'soundOff';
  }

  return percent < 50 ? 'soundLow' : 'sound';
}
