import { useEffect } from 'react';

import { HeroPanel } from '../features/heroes/components/HeroPanel.tsx';
import { ModifierPanel } from '../features/modifiers/components/ModifierPanel.tsx';
import { useRandomizerStore } from '../store/useRandomizerStore.ts';

// Targets that use letter keys themselves; H and M still roll from buttons and links
const LETTER_OWNING_TARGETS =
  'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="radiogroup"], [role="radio"], [role="dialog"]';

export function MainScreen() {
  const rollHeroes = useRandomizerStore((state) => state.rollHeroes);
  const rollModifiers = useRandomizerStore((state) => state.rollModifiers);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const hasModifierKey = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

      if (event.repeat || event.defaultPrevented || hasModifierKey) {
        return;
      }
      if (event.target instanceof Element && event.target.closest(LETTER_OWNING_TARGETS)) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'h':
          rollHeroes();
          break;
        case 'm':
          rollModifiers();
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rollHeroes, rollModifiers]);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 min-[900px]:grid-cols-2 min-[900px]:gap-[26px]">
      <HeroPanel />
      <ModifierPanel />
    </div>
  );
}
