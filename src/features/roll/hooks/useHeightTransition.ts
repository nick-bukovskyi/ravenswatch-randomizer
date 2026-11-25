import { useEffect, useRef } from 'react';

/**
 * Gives `body` the measured height of `content`, so the CSS height transition on `body` animates
 * content changes; a width change (first measure, window resize) applies at once
 */
export function useHeightTransition() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    const content = contentRef.current;

    if (!body || !content) {
      return;
    }

    let lastWidth: number | null = null;

    const observer = new ResizeObserver(() => {
      const { width, height } = content.getBoundingClientRect();

      if (width === lastWidth) {
        body.style.height = `${height}px`;

        return;
      }

      lastWidth = width;
      body.style.transition = 'none';
      body.style.height = `${height}px`;
      // Reading layout commits the height before the transition comes back
      body.getBoundingClientRect();
      body.style.transition = '';
    });

    observer.observe(content);

    return () => observer.disconnect();
  }, []);

  return { bodyRef, contentRef };
}
