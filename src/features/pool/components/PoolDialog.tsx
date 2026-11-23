import { useState } from 'react';

import { useTemporaryState } from '../../../shared/hooks/useTemporaryState.ts';
import { Button } from '../../../shared/ui/Button.tsx';
import { GameDialog, type DialogNotice } from '../../../shared/ui/GameDialog.tsx';
import { Icon } from '../../../shared/ui/Icon.tsx';
import { ToolButton } from '../../../shared/ui/ToolButton.tsx';
import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import { heroes } from '../../heroes/data/heroes.ts';
import { modifiers, type Modifier } from '../../modifiers/data/modifiers.ts';
import { BanCountBadge } from './BanCountBadge.tsx';
import { PoolGroup } from './PoolGroup.tsx';
import { PoolHeroTile } from './PoolHeroTile.tsx';
import { PoolModifierTile } from './PoolModifierTile.tsx';

const goodModifiers = modifiers.filter((modifier) => modifier.polarity === 'good');
const badModifiers = modifiers.filter((modifier) => modifier.polarity === 'bad');

const NOTICE_MS = 3500;

export function PoolDialog() {
  const bans = useRandomizerStore((state) => state.bans);
  const resetBans = useRandomizerStore((state) => state.resetBans);

  const [isOpen, setIsOpen] = useState(false);
  const [notice, setNotice] = useTemporaryState<DialogNotice | null>(null, NOTICE_MS);

  const banCount = bans.heroIds.length + bans.modifierIds.length;

  const countBanned = (group: readonly Modifier[]) =>
    group.filter((modifier) => bans.modifierIds.includes(modifier.id)).length;

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

    resetBans();
    showNotice('Every hero and modifier is back in the pool', 'info');
  }

  return (
    <GameDialog
      open={isOpen}
      trigger={
        <ToolButton label="Pool" icon="pool">
          <BanCountBadge count={banCount} />
        </ToolButton>
      }
      title="The Pool"
      description={
        <>
          Banned heroes and modifiers are never rolled.{' '}
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
      <PoolGroup
        title="Heroes"
        available={heroes.length - bans.heroIds.length}
        total={heroes.length}
        tone="gold"
        listClassName="grid grid-cols-4 gap-x-1 gap-y-2 min-[480px]:grid-cols-5 md:grid-cols-7"
      >
        {heroes.map((hero) => (
          <PoolHeroTile
            key={hero.id}
            hero={hero}
            onLastHeroRefused={() =>
              showNotice('At least one hero must stay in the pool', 'warning')
            }
          />
        ))}
      </PoolGroup>

      <div className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-2">
        <PoolGroup
          title="Good modifiers"
          available={goodModifiers.length - countBanned(goodModifiers)}
          total={goodModifiers.length}
          tone="positive"
          listClassName="flex flex-col gap-2"
        >
          {goodModifiers.map((modifier) => (
            <PoolModifierTile key={modifier.id} modifier={modifier} />
          ))}
        </PoolGroup>
        <PoolGroup
          title="Bad modifiers"
          available={badModifiers.length - countBanned(badModifiers)}
          total={badModifiers.length}
          tone="negative"
          listClassName="flex flex-col gap-2"
        >
          {badModifiers.map((modifier) => (
            <PoolModifierTile key={modifier.id} modifier={modifier} />
          ))}
        </PoolGroup>
      </div>
    </GameDialog>
  );
}
