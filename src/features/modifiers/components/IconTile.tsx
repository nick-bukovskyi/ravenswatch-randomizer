import { cn } from '../../../shared/lib/cn.ts';
import type { ModifierPolarity } from '../data/modifiers.ts';
import { ModifierGlyph } from './ModifierGlyph.tsx';

interface IconTileProps {
  icon: string;
  polarity: ModifierPolarity;
  className?: string;
}

export function IconTile({ icon, polarity, className }: IconTileProps) {
  return (
    <span
      data-tone={polarity === 'good' ? 'positive' : 'negative'}
      className={cn('icon-tile', className)}
    >
      <ModifierGlyph icon={icon} />
    </span>
  );
}
