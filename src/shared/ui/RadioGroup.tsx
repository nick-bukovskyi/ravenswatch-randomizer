import type { KeyboardEvent, ReactNode } from 'react';

interface RadioGroupProps {
  label: string;
  /** `role="radio"` buttons; only the checked one has `tabIndex={0}` */
  children: ReactNode;
  className?: string;
}

function nextIndex(key: string, currentIndex: number, count: number): number | null {
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (currentIndex + 1) % count;
    case 'ArrowLeft':
    case 'ArrowUp':
      return (currentIndex - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
}

export function RadioGroup({ label, children, className }: RadioGroupProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const radios = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        '[role="radio"]:not([aria-disabled="true"])',
      ),
    );
    const currentIndex = radios.findIndex((radio) => radio === document.activeElement);
    const nextRadio = radios[nextIndex(event.key, currentIndex, radios.length) ?? -1];

    if (!nextRadio) {
      return;
    }

    event.preventDefault();
    nextRadio.focus();
    nextRadio.click();
  }

  return (
    <div role="radiogroup" aria-label={label} className={className} onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
}
