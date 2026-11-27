import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  rollLabel: string;
  drawText: string;
  shouldAnimateIn: boolean;
  children: ReactNode;
}

export function EmptyState({
  title,
  rollLabel,
  drawText,
  shouldAnimateIn,
  children,
}: EmptyStateProps) {
  return (
    <div
      data-animate-in={shouldAnimateIn}
      className="empty-state flex flex-col items-center gap-3.5 px-4 py-3 text-center"
    >
      <div aria-hidden="true" className="flex min-h-[150px] w-full items-center justify-center">
        {children}
      </div>
      <h3 className="text-[26px] tracking-[0.04em] text-cream-bright text-engraved">{title}</h3>
      <p className="max-w-[30ch] font-body text-lg leading-[1.3] text-cream-muted">
        Press <b className="font-medium text-gold-300">{rollLabel}</b> to draw {drawText}
      </p>
    </div>
  );
}
