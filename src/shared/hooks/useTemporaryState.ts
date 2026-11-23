import { useEffect, useState } from 'react';

/** Pass a primitive or `null` as `restingValue` so it stays the same between renders */
export function useTemporaryState<T>(restingValue: T, durationMs: number) {
  const [value, setValue] = useState(restingValue);

  useEffect(() => {
    if (value === restingValue) {
      return;
    }

    const timer = window.setTimeout(() => setValue(restingValue), durationMs);

    return () => window.clearTimeout(timer);
  }, [value, restingValue, durationMs]);

  return [value, setValue] as const;
}
