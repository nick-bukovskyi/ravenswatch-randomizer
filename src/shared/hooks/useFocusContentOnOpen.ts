import { useRef } from 'react';

/**
 * Focuses the panel, not its first control: a focused control would open its tooltip at once,
 * and a stray Space or Enter could press it. Put `contentRef` on the focusable panel
 */
export function useFocusContentOnOpen() {
  const contentRef = useRef<HTMLDivElement>(null);

  function handleOpenAutoFocus(event: Event) {
    event.preventDefault();
    contentRef.current?.focus();
  }

  return { contentRef, handleOpenAutoFocus };
}
