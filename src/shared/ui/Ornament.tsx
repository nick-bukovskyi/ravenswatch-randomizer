import { cn } from '../lib/cn.ts';

interface OrnamentProps {
  className?: string;
}

export function Ornament({ className }: OrnamentProps) {
  return (
    <div aria-hidden="true" className={cn('flex items-center gap-2', className)}>
      <span className="h-px flex-1 bg-linear-to-r from-transparent via-gold-700 to-gold-500" />
      <svg viewBox="0 0 28 10" className="h-2.5 w-7 shrink-0">
        <circle cx="3" cy="5" r="1.2" className="fill-gold-700" />
        <path
          d="M14 0.5l4.5 4.5-4.5 4.5-4.5-4.5z"
          className="fill-gold-500 stroke-gold-100"
          strokeWidth="0.6"
        />
        <circle cx="25" cy="5" r="1.2" className="fill-gold-700" />
      </svg>
      <span className="h-px flex-1 bg-linear-to-l from-transparent via-gold-700 to-gold-500" />
    </div>
  );
}
