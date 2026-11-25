import 'react';

// Read by features/roll/styles/ink-reveal.css, features/heroes/styles/hero-card.css and
// features/sound/styles/volume-slider.css
declare module 'react' {
  interface CSSProperties {
    '--ink-delay'?: string;
    '--ink-leave-delay'?: string;
    '--art-x'?: number;
    '--art-y'?: number;
    '--art-zoom'?: number;
    '--volume'?: string;
  }
}
