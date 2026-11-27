import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import { modifiers, type Modifier } from '../../modifiers/data/modifiers.ts';
import { PoolGroup } from './PoolGroup.tsx';
import { PoolModifierTile } from './PoolModifierTile.tsx';

const goodModifiers = modifiers.filter((modifier) => modifier.polarity === 'good');
const badModifiers = modifiers.filter((modifier) => modifier.polarity === 'bad');

export function ModifierPool() {
  const bannedIds = useRandomizerStore((state) => state.bans.modifierIds);

  const countBanned = (group: readonly Modifier[]) =>
    group.filter((modifier) => bannedIds.includes(modifier.id)).length;

  return (
    <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
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
  );
}
