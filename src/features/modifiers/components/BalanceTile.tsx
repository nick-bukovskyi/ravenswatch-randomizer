import balanceIcon from '../../../assets/modifiers/balance.svg';
import { cn } from '../../../shared/lib/cn.ts';
import { ModifierGlyph } from './ModifierGlyph.tsx';

interface BalanceTileProps {
  className?: string;
}

export function BalanceTile({ className }: BalanceTileProps) {
  return (
    <span aria-hidden="true" className={cn('split-tile balance-tile', className)}>
      <span className="split-tile__good" />
      <span className="split-tile__bad" />
      <span className="balance-tile__glyph">
        <ModifierGlyph icon={balanceIcon} />
      </span>
    </span>
  );
}
