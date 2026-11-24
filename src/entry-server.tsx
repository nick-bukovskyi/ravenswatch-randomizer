import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';

import { App } from './app/App.tsx';

/** Used by scripts/prerender.js */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
