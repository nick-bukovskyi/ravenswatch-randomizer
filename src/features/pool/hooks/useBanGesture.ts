import { useEffect, useRef, type MouseEvent, type PointerEvent } from 'react';

const LONG_PRESS_MS = 450;
const MOVE_TOLERANCE = 10;

interface Press {
  x: number;
  y: number;
  isHandled: boolean;
}

interface BanGestureHandlers {
  onClick: (event: MouseEvent<HTMLElement>) => void;
  onContextMenu: (event: MouseEvent<HTMLElement>) => void;
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
}

/**
 * Android reports a long-press as both a timer hit and a context menu, and some browsers click
 * on release, so a press toggles at most once
 */
export function useBanGesture(onToggle: () => void): BanGestureHandlers {
  const timerRef = useRef<number | undefined>(undefined);
  const pressRef = useRef<Press>({ x: 0, y: 0, isHandled: false });

  function toggleOncePerPress() {
    window.clearTimeout(timerRef.current);

    if (pressRef.current.isHandled) {
      return;
    }

    pressRef.current.isHandled = true;
    onToggle();
  }

  function cancelLongPress() {
    window.clearTimeout(timerRef.current);
  }

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return {
    onClick: (event) => {
      // `detail` is 0 for keyboard clicks, which never follow a gesture
      if (event.detail > 0 && pressRef.current.isHandled) {
        return;
      }

      onToggle();
    },
    onContextMenu: (event) => {
      event.preventDefault();
      toggleOncePerPress();
    },
    onPointerDown: (event) => {
      cancelLongPress();
      pressRef.current = { x: event.clientX, y: event.clientY, isHandled: false };

      if (event.pointerType === 'mouse') {
        return;
      }

      timerRef.current = window.setTimeout(() => {
        toggleOncePerPress();

        if ('vibrate' in navigator) {
          navigator.vibrate(12);
        }
      }, LONG_PRESS_MS);
    },
    onPointerMove: (event) => {
      const { x, y } = pressRef.current;

      if (Math.hypot(event.clientX - x, event.clientY - y) > MOVE_TOLERANCE) {
        cancelLongPress();
      }
    },
    onPointerUp: cancelLongPress,
    onPointerCancel: cancelLongPress,
  };
}
