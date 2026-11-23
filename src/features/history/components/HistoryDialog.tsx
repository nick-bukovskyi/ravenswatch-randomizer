import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { useTemporaryState } from '../../../shared/hooks/useTemporaryState.ts';
import { STAGGER_ITEM_VARIANTS, STAGGER_LIST_VARIANTS } from '../../../shared/lib/staggerMotion.ts';
import { Button } from '../../../shared/ui/Button.tsx';
import { GameDialog, type DialogNotice } from '../../../shared/ui/GameDialog.tsx';
import { Icon } from '../../../shared/ui/Icon.tsx';
import { Ornament } from '../../../shared/ui/Ornament.tsx';
import { ToolButton } from '../../../shared/ui/ToolButton.tsx';
import { HISTORY_LIMIT } from '../../../store/savedState.ts';
import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import { encodeShareQuery } from '../../share/lib/shareUrl.ts';
import { HistoryEntryButton } from './HistoryEntryButton.tsx';

type ClearStep = 'idle' | 'confirming' | 'cleared';

const CLEAR_STEP_MS = 4000;

const CLEAR_NOTICES: Record<Exclude<ClearStep, 'idle'>, DialogNotice> = {
  confirming: { id: 1, message: 'Press Clear again to delete every saved roll', tone: 'warning' },
  cleared: { id: 2, message: 'History cleared', tone: 'info' },
};

export function HistoryDialog() {
  const history = useRandomizerStore((state) => state.history);
  const shownQuery = useRandomizerStore((state) => encodeShareQuery(state));
  const restoreFromQuery = useRandomizerStore((state) => state.restoreFromQuery);
  const clearHistory = useRandomizerStore((state) => state.clearHistory);

  const [openState, setOpenState] = useState({ isOpen: false, openedAt: 0 });
  const [clearStep, setClearStep] = useTemporaryState<ClearStep>('idle', CLEAR_STEP_MS);

  const isEmpty = history.length === 0;

  function handleOpenChange(open: boolean) {
    setOpenState({ isOpen: open, openedAt: open ? Date.now() : openState.openedAt });
    setClearStep('idle');
  }

  function handleRestore(query: string) {
    restoreFromQuery(query);
    handleOpenChange(false);
  }

  function handleClear() {
    if (isEmpty) {
      return;
    }
    if (clearStep !== 'confirming') {
      setClearStep('confirming');

      return;
    }

    clearHistory();
    setClearStep('cleared');
  }

  function handleClearBlur() {
    if (clearStep === 'confirming') {
      setClearStep('idle');
    }
  }

  return (
    <GameDialog
      open={openState.isOpen}
      trigger={<ToolButton label="History" icon="history" />}
      title="Past Rolls"
      description={`Your last ${HISTORY_LIMIT} rolls, saved in this browser. Choose one to bring it back with its settings.`}
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button
            variant={clearStep === 'confirming' ? 'primary' : 'secondary'}
            size="sm"
            aria-disabled={isEmpty}
            className="[&_svg]:size-4"
            onClick={handleClear}
            onBlur={handleClearBlur}
          >
            <Icon name="trash" />
            {clearStep === 'confirming' ? 'Clear' : 'Clear history'}
          </Button>
          <Button size="sm" onClick={() => handleOpenChange(false)}>
            Done
          </Button>
        </div>
      }
      notice={clearStep === 'idle' ? null : CLEAR_NOTICES[clearStep]}
      onOpenChange={handleOpenChange}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isEmpty ? (
          <motion.div
            key="empty"
            className="flex flex-col items-center px-4 py-10 text-center sm:py-14"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span className="grid size-16 place-items-center rounded-full border border-gold-700/70 bg-panel-deep text-gold-500 shadow-[inset_0_2px_10px_rgb(0_0_0/0.6)] [&_svg]:size-8">
              <Icon name="history" />
            </span>
            <p className="mt-4 text-2xl text-cream-bright text-engraved">No rolls yet</p>
            <Ornament className="mt-2 w-40" />
            <p className="mt-3 max-w-xs font-body text-base text-cream-muted">
              Every roll you make is kept here, up to the last {HISTORY_LIMIT}
            </p>
          </motion.div>
        ) : (
          <motion.ol
            key="list"
            className="grid gap-2.5 lg:grid-cols-2"
            variants={STAGGER_LIST_VARIANTS}
            initial="hidden"
            animate="shown"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {history.map((entry) => (
              <motion.li key={`${entry.timestamp}-${entry.query}`} variants={STAGGER_ITEM_VARIANTS}>
                <HistoryEntryButton
                  entry={entry}
                  now={openState.openedAt}
                  isShown={entry.query === shownQuery}
                  onRestore={handleRestore}
                />
              </motion.li>
            ))}
          </motion.ol>
        )}
      </AnimatePresence>
    </GameDialog>
  );
}
