import type { ReactNode } from 'react';

import { cn } from '../lib/cn.ts';

interface PortraitFrameProps {
  children: ReactNode;
  className?: string;
}

export function PortraitFrame({ children, className }: PortraitFrameProps) {
  return (
    <span className={cn('portrait-frame relative', className)}>
      <span className="relative block size-full overflow-hidden">{children}</span>
    </span>
  );
}
