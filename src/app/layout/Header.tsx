import { HistoryDialog } from '../../features/history/components/HistoryDialog.tsx';
import { ShareButton } from '../../features/share/components/ShareButton.tsx';
import { VolumeControl } from '../../features/sound/components/VolumeControl.tsx';
import { Wordmark } from './Wordmark.tsx';

export function Header() {
  return (
    <header className="flex items-center justify-between gap-3 pt-3.5 pb-[26px]">
      <Wordmark />
      <div className="flex gap-0.5">
        <HistoryDialog />
        <ShareButton />
        <VolumeControl />
      </div>
    </header>
  );
}
