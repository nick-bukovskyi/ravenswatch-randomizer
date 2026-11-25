import 'react';

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
