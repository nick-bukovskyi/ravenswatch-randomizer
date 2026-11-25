import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import { modifierById } from '../../modifiers/data/modifiers.ts';
import type { CardKind } from '../../roll/lib/roll.ts';
import { onRollEvent } from '../../roll/lib/rollEvents.ts';
import type { SoundName, SoundPlayer } from './soundPlayer.ts';

/** Beats closer than this (a restore reveals both groups at once) play once */
const SAME_BEAT_MS = 40;
/** The ban seal (BanSeal) mounts and its spring reaches the tile this long after the click */
const SEAL_CONTACT_MS = 100;
/** The wood click tuned into D for each landing hero (D4, E4, F#4, A4, B4 from its own pitch) */
const HERO_NOTE_RATES = [1.138, 1.278, 0.717, 0.853, 0.957] as const;
const BAD_MODIFIER_RATE = 0.84;
/** Unlock and unban play the switch tap a little higher than lock and ban */
const UNLOCK_RATE = 1.1;

let player: SoundPlayer | null = null;
let lastStampAt = Number.NEGATIVE_INFINITY;
let lastRingAt = Number.NEGATIVE_INFINITY;

export function startSoundEffects(): () => void {
  const stopGestureWatch = loadOnFirstGesture();
  const unsubscribers = [
    onRollEvent('cardStart', ({ kind }) => {
      // Only hero cards draw a frame
      if (kind === 'hero') {
        play('inkSwell');
      }
    }),
    onRollEvent('cardStamp', playStamp),
    onRollEvent('cardRing', ({ kind, id, index }) => playRing(kind, id, index)),
    onRollEvent('scoreTick', () => play('typewriterHit')),
    useRandomizerStore.subscribe((state, previous) => {
      if (state.volume !== previous.volume) {
        player?.setVolume(state.volume);
      }
    }),
  ];

  return () => {
    stopGestureWatch();

    for (const unsubscribe of unsubscribers) {
      unsubscribe();
    }
  };
}

export function playLock(): void {
  play('switchTap');
}

export function playUnlock(): void {
  play('switchTap', UNLOCK_RATE);
}

export function playBan(): void {
  window.setTimeout(playLock, SEAL_CONTACT_MS);
}

export function playUnban(): void {
  playUnlock();
}

export function playRefusal(): void {
  play('doubleKnock');
}

export function playVolumePreview(): void {
  play('woodClick');
}

function playStamp(): void {
  const now = performance.now();

  if (now - lastStampAt < SAME_BEAT_MS) {
    return;
  }

  lastStampAt = now;
  play('lowHit', vary(1, 0.03));
}

function playRing(kind: CardKind, id: string, index: number): void {
  const now = performance.now();

  if (now - lastRingAt < SAME_BEAT_MS) {
    return;
  }

  lastRingAt = now;

  switch (kind) {
    case 'hero': {
      play('woodClick', HERO_NOTE_RATES[index % HERO_NOTE_RATES.length] ?? 1);

      return;
    }
    case 'modifier': {
      play('woodClick', modifierById.get(id)?.polarity === 'bad' ? BAD_MODIFIER_RATE : 1);

      return;
    }
  }
}

function play(name: SoundName, rate = 1): void {
  player?.play(name, rate);
}

function vary(center: number, spread: number): number {
  return center * (1 + (Math.random() * 2 - 1) * spread);
}

/** Browsers block creating the audio context before a user gesture */
function loadOnFirstGesture(): () => void {
  const events = ['pointerdown', 'pointerup', 'keydown'] as const;

  function stopWatching() {
    for (const event of events) {
      window.removeEventListener(event, handleGesture, true);
    }
  }

  function handleGesture() {
    // A touch press counts as a gesture only on release; without the activation API, every event does
    if ('userActivation' in navigator && !navigator.userActivation.isActive) {
      return;
    }

    stopWatching();
    loadSounds();
  }

  for (const event of events) {
    window.addEventListener(event, handleGesture, true);
  }

  return stopWatching;
}

function loadSounds(): void {
  import('./soundPlayer.ts')
    .then(({ createSoundPlayer }) => {
      player = createSoundPlayer(useRandomizerStore.getState().volume);
    })
    .catch(() => {
      // Sounds are optional, so a failed download leaves the app silent
    });
}
