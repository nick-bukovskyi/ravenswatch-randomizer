import { ToolButton } from '../../../shared/ui/ToolButton.tsx';
import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import { playUiClick } from '../lib/soundEffects.ts';

export function SoundToggle() {
  const muted = useRandomizerStore((state) => state.muted);
  const toggleMuted = useRandomizerStore((state) => state.toggleMuted);

  function handleClick() {
    toggleMuted();

    if (muted) {
      playUiClick();
    }
  }

  return (
    <ToolButton
      label="Mute sound"
      icon={muted ? 'soundOff' : 'sound'}
      tooltip={muted ? 'Unmute sound' : 'Mute sound'}
      aria-pressed={muted}
      onClick={handleClick}
    />
  );
}
