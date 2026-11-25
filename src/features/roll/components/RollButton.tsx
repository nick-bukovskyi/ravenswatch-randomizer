import type { Ref } from 'react';

import { Button } from '../../../shared/ui/Button.tsx';
import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import type { CardKind } from '../lib/roll.ts';

interface RollButtonProps {
  kind: CardKind;
  ref?: Ref<HTMLButtonElement>;
}

const LABELS: Record<CardKind, string> = { hero: 'Roll heroes', modifier: 'Roll modifiers' };

export function RollButton({ kind, ref }: RollButtonProps) {
  const roll = useRandomizerStore((state) =>
    kind === 'hero' ? state.rollHeroes : state.rollModifiers,
  );
  const isEmpty = useRandomizerStore((state) =>
    kind === 'hero' ? state.result.heroIds.length === 0 : state.result.modifierIds.length === 0,
  );

  return (
    <Button
      ref={ref}
      data-waiting={isEmpty}
      className="roll-button w-44 px-[22px] @max-[432px]:order-3 @max-[432px]:w-full"
      onClick={roll}
    >
      {LABELS[kind]}
    </Button>
  );
}
