import type { ComponentPropsWithRef } from 'react';

import { Icon, type IconName } from '../../../shared/ui/Icon.tsx';
import { Tooltip } from '../../../shared/ui/Tooltip.tsx';

interface CardActionButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'aria-label'> {
  label: string;
  icon: IconName;
  tooltip: string;
}

export function CardActionButton({ label, icon, tooltip, ...props }: CardActionButtonProps) {
  return (
    <Tooltip content={tooltip}>
      <button type="button" aria-label={label} className="card-actions__button" {...props}>
        <Icon name={icon} />
      </button>
    </Tooltip>
  );
}
