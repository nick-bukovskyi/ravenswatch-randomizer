import { cn } from '../../../shared/lib/cn.ts';
import { RadioGroup } from '../../../shared/ui/RadioGroup.tsx';
import type { CountLimits } from '../lib/roll.ts';

interface CountPickerProps {
  label: string;
  value: number;
  limits: CountLimits;
  onChange: (value: number) => void;
}

export function CountPicker({ label, value, limits, onChange }: CountPickerProps) {
  return (
    <RadioGroup label={label} className="flex justify-center gap-1.5">
      {Array.from({ length: limits.max }, (_, index) => index + 1).map((count) => {
        const isChecked = count === value;
        const isDisabled = count < limits.min;

        return (
          <button
            key={count}
            type="button"
            role="radio"
            aria-checked={isChecked}
            aria-disabled={isDisabled || undefined}
            tabIndex={isChecked ? 0 : -1}
            className={cn(
              'size-10 cursor-pointer rounded-full bg-white/6 pt-[3px] text-[19px] text-cream transition-[background-color,transform] duration-150 hover:-translate-y-px hover:bg-white/14 aria-disabled:cursor-not-allowed aria-disabled:opacity-35 aria-disabled:hover:translate-y-0 aria-disabled:hover:bg-white/6',
              isChecked &&
                'bg-linear-to-b from-crimson-400 to-crimson-700 text-cream-bright shadow-[0_0_14px_color-mix(in_srgb,var(--color-crimson-300)_45%,transparent)]',
            )}
            onClick={isDisabled ? undefined : () => onChange(count)}
          >
            {count}
          </button>
        );
      })}
    </RadioGroup>
  );
}
