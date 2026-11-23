import { HistoryDialog } from '../../features/history/components/HistoryDialog.tsx';
import { PoolDialog } from '../../features/pool/components/PoolDialog.tsx';
import { ShareButton } from '../../features/share/components/ShareButton.tsx';
import { SoundToggle } from '../../features/sound/components/SoundToggle.tsx';
import { Wordmark } from './Wordmark.tsx';

export function Header() {
  return (
    <header className="flex items-center justify-between gap-3 pt-3.5 pb-[26px]">
      <Wordmark />
      <div className="flex gap-0.5">
        <PoolDialog />
        <HistoryDialog />
        <ShareButton />
        <SoundToggle />
      </div>
    </header>
  );
}
