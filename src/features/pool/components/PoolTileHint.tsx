import { cn } from '../../../shared/lib/cn.ts';
import { Icon } from '../../../shared/ui/Icon.tsx';

interface PoolTileHintProps {
  isBanned: boolean;
  className?: string;
}

/** Needs a `group/tile` ancestor */
export function PoolTileHint({ isBanned, className }: PoolTileHintProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute z-10 flex items-center gap-1 rounded-full border bg-night-deep/90 px-2 py-0.5 font-display text-xs tracking-[0.12em] whitespace-nowrap uppercase opacity-0 transition-opacity duration-200 group-hover/tile:opacity-100 group-focus-visible/tile:opacity-100 [&_svg]:size-3',
        isBanned ? 'border-gold-700 text-gold-300' : 'border-crimson-300/70 text-crimson-300',
        className,
      )}
    >
      {!isBanned && <Icon name="ban" />}
      {isBanned ? 'Unban' : 'Ban'}
    </span>
  );
}
