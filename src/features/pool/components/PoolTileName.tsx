import { cn } from '../../../shared/lib/cn.ts';

interface PoolTileNameProps {
  name: string;
  className: string;
}

export function PoolTileName({ name, className }: PoolTileNameProps) {
  return (
    <span className={cn('relative', className)}>
      {name}
      <span aria-hidden="true" className="pool-tile__strike-layer">
        <span className="pool-tile__strike">{name}</span>
      </span>
    </span>
  );
}
