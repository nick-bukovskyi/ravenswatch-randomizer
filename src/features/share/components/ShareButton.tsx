import * as Toast from '@radix-ui/react-toast';
import { useState } from 'react';

import { ToolButton } from '../../../shared/ui/ToolButton.tsx';
import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import { hasCards } from '../../roll/lib/roll.ts';

interface ShareNotice {
  readonly id: number;
  readonly message: string;
}

export function ShareButton() {
  const hasResult = useRandomizerStore((state) => hasCards(state.result));

  const [notice, setNotice] = useState<ShareNotice | null>(null);

  function handleShare() {
    const show = (message: string) =>
      setNotice((current) => ({ id: (current?.id ?? 0) + 1, message }));

    if (!hasResult) {
      show('Nothing to share yet. Roll heroes or modifiers first.');

      return;
    }

    // Inside the chain so a missing Clipboard API rejects like a denied write
    Promise.resolve()
      .then(() => navigator.clipboard.writeText(window.location.href))
      .then(
        () => show('Link copied. Anyone who opens it sees this roll.'),
        () => show('Could not copy the link. Copy it from the address bar.'),
      );
  }

  return (
    <>
      <ToolButton label="Share" icon="link" onClick={handleShare} />
      {notice && (
        <Toast.Root
          key={notice.id}
          duration={3200}
          className="share-button__toast flex items-center gap-3 rounded-[4px] border border-gold-700 bg-panel-deep px-4 py-3 shadow-[0_18px_40px_-12px_rgb(0_0_0/0.95)]"
          onOpenChange={(isOpen) => !isOpen && setNotice(null)}
        >
          <span aria-hidden="true" className="size-2 shrink-0 rotate-45 bg-gold-300" />
          <Toast.Title className="font-body text-base text-cream">{notice.message}</Toast.Title>
        </Toast.Root>
      )}
    </>
  );
}
