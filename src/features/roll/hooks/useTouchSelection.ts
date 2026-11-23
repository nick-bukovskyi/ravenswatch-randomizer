import { useEffect, useRef, useState, type MouseEvent } from 'react';

const HOVER_QUERY = '(hover: hover)';

export function useTouchSelection<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const [isSelected, setIsSelected] = useState(false);

  function handleClick(event: MouseEvent<T>) {
    const isActionPress = event.target instanceof Element && event.target.closest('button');

    if (window.matchMedia(HOVER_QUERY).matches || isActionPress) {
      return;
    }

    setIsSelected((selected) => !selected);
  }

  useEffect(() => {
    if (!isSelected) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !ref.current?.contains(event.target)) {
        setIsSelected(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsSelected(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSelected]);

  return { ref, isSelected, onClick: handleClick };
}
