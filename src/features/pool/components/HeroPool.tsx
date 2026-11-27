import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import { heroes } from '../../heroes/data/heroes.ts';
import { PoolGroup } from './PoolGroup.tsx';
import { PoolHeroTile } from './PoolHeroTile.tsx';

interface HeroPoolProps {
  onLastHeroRefused: () => void;
}

export function HeroPool({ onLastHeroRefused }: HeroPoolProps) {
  const bannedCount = useRandomizerStore((state) => state.bans.heroIds.length);

  return (
    <PoolGroup
      title="Heroes"
      available={heroes.length - bannedCount}
      total={heroes.length}
      tone="gold"
      listClassName="grid grid-cols-4 gap-x-1 gap-y-2 min-[480px]:grid-cols-5 md:grid-cols-7"
    >
      {heroes.map((hero) => (
        <PoolHeroTile key={hero.id} hero={hero} onLastHeroRefused={onLastHeroRefused} />
      ))}
    </PoolGroup>
  );
}
