import { cn } from '../../../shared/lib/cn.ts';

interface PoolGroupHeadingProps {
  id: string;
  title: string;
  available: number;
  total: number;
  tone: 'gold' | 'positive' | 'negative';
}

export function PoolGroupHeading({ id, title, available, total, tone }: PoolGroupHeadingProps) {
  return (
    <div className="mb-3 flex items-center gap-3 border-b border-white/8 pb-2">
      <span
        aria-hidden="true"
        className={cn(
          'size-2 shrink-0 rotate-45',
          tone === 'gold' && 'bg-gold-300',
          tone === 'positive' && 'bg-positive-300',
          tone === 'negative' && 'bg-negative-300',
        )}
      />
      <h3 id={id} className="pool-group-heading__title flex-1">
        {title}
      </h3>
      <p
        className={cn(
          'font-body text-sm tabular-nums',
          available < total ? 'text-gold-300' : 'text-cream-muted',
        )}
      >
        {available} of {total} in pool
      </p>
    </div>
  );
}
