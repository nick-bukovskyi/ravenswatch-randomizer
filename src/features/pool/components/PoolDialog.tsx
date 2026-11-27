import { useState } from 'react';

import { useTemporaryState } from '../../../shared/hooks/useTemporaryState.ts';
import { cn } from '../../../shared/lib/cn.ts';
import { Button } from '../../../shared/ui/Button.tsx';
import { GameDialog, type DialogNotice } from '../../../shared/ui/GameDialog.tsx';
import { Icon } from '../../../shared/ui/Icon.tsx';
import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import type { CardKind } from '../../roll/lib/roll.ts';
import { HeroPool } from './HeroPool.tsx';
import { ModifierPool } from './ModifierPool.tsx';

interface PoolDialogProps {
  kind: CardKind;
}

interface PoolCopy {
  title: string;
  items: string;
  resetNotice: string;
}

const NOTICE_MS = 3500;

const COPY: Record<CardKind, PoolCopy> = {
  hero: { title: 'Hero Pool', items: 'heroes', resetNotice: 'Every hero is back in the pool' },
  modifier: {
    title: 'Modifier Pool',
    items: 'modifiers',
    resetNotice: 'Every modifier is back in the pool',
  },
};

export function PoolDialog({ kind }: PoolDialogProps) {
  const banCount = useRandomizerStore((state) =>
    kind === 'hero' ? state.bans.heroIds.length : state.bans.modifierIds.length,
  );
  const resetBans = useRandomizerStore((state) => state.resetBans);

  const [isOpen, setIsOpen] = useState(false);
  const [notice, setNotice] = useTemporaryState<DialogNotice | null>(null, NOTICE_MS);

  const { title, items, resetNotice } = COPY[kind];

  function showNotice(message: string, tone: DialogNotice['tone']) {
    setNotice((current) => ({ id: (current?.id ?? 0) + 1, message, tone }));
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    setNotice(null);
  }

  function handleReset() {
    if (banCount === 0) {
      return;
    }

    resetBans(kind);
    showNotice(resetNotice, 'info');
  }

  return (
    <GameDialog
      open={isOpen}
      trigger={
        <button
          type="button"
          className={cn(
            'inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 pt-0.5 font-body text-base whitespace-nowrap underline decoration-1 underline-offset-4 transition-colors duration-200 hover:text-gold-100',
            banCount > 0 ? 'text-gold-300' : 'text-cream-muted',
          )}
        >
          <Icon name="ban" className={cn('-mt-0.5 size-4', banCount > 0 && 'text-crimson-300')} />
          <span className="sr-only">{title}: </span>
          {banCount > 0 ? `${banCount} banned` : 'No bans'}
        </button>
      }
      title={title}
      description={
        <>
          Banned {items} are never rolled.{' '}
          <span className="pointer-coarse:hidden">Click or right-click to ban or unban.</span>
          <span className="hidden pointer-coarse:inline">Tap or long-press to ban or unban.</span>
        </>
      }
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            size="sm"
            aria-disabled={banCount === 0}
            className="[&_svg]:size-4"
            onClick={handleReset}
          >
            <Icon name="reroll" />
            Reset bans
          </Button>
          <Button size="sm" onClick={() => handleOpenChange(false)}>
            Done
          </Button>
        </div>
      }
      notice={notice}
      onOpenChange={handleOpenChange}
    >
      {kind === 'hero' ? (
        <HeroPool
          onLastHeroRefused={() => showNotice('At least one hero must stay in the pool', 'warning')}
        />
      ) : (
        <ModifierPool />
      )}
    </GameDialog>
  );
}
