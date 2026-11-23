import { hasCards } from '../features/roll/lib/roll.ts';
import { encodeShareQuery } from '../features/share/lib/shareUrl.ts';
import { useRandomizerStore, type RandomizerState } from './useRandomizerStore.ts';

export function startUrlSync(): () => void {
  if (window.location.search !== '') {
    useRandomizerStore.getState().restoreFromQuery(window.location.search);
  }

  writeUrl(useRandomizerStore.getState());

  return useRandomizerStore.subscribe(writeUrl);
}

function writeUrl({ result, settings }: RandomizerState): void {
  const url = new URL(window.location.href);

  url.search = hasCards(result) ? encodeShareQuery({ result, settings }) : '';

  // replaceState so rolls add no browser history entries
  if (url.href !== window.location.href) {
    window.history.replaceState(window.history.state, '', url);
  }
}
