import { cn } from '../../../shared/lib/cn.ts';
import { ModifierGlyph } from './ModifierGlyph.tsx';

interface SplitTileProps {
  goodIcon: string;
  badIcon: string;
  className?: string;
}

export function SplitTile({ goodIcon, badIcon, className }: SplitTileProps) {
  return (
    <span aria-hidden="true" className={cn('split-tile', className)}>
      <span className="split-tile__good" />
      <span className="split-tile__bad" />
      <span className="split-tile__glyph left-1/4">
        <ModifierGlyph icon={goodIcon} />
      </span>
      <span className="split-tile__glyph left-3/4">
        <ModifierGlyph icon={badIcon} />
      </span>
    </span>
  );
}
