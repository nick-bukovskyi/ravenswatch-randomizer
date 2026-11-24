import '@fontsource/germania-one/400.css';
import '@fontsource/alegreya-sans/400.css';
import '@fontsource/alegreya-sans/500.css';
import '@fontsource/alegreya-sans/700.css';
import './index.css';

import { StrictMode } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, hydrateRoot } from 'react-dom/client';

import { App } from './app/App.tsx';
import { startSoundEffects } from './features/sound/lib/soundEffects.ts';
import { startUrlSync } from './store/urlSync.ts';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Missing #root element in index.html');
}

// Before the first render, so a shared link shows its roll immediately
startUrlSync();
startSoundEffects();

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The prerender shows only the default state, so restored state renders fresh
const isRestoring = document.documentElement.hasAttribute('data-restoring');

if (isRestoring || rootElement.firstElementChild === null) {
  const root = createRoot(rootElement);

  flushSync(() => root.render(app));
  document.documentElement.removeAttribute('data-restoring');
} else {
  hydrateRoot(rootElement, app);
}
