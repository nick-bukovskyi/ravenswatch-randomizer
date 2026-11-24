import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import type { CardKind } from '../../roll/lib/roll.ts';
import { onRollEvent } from '../../roll/lib/rollEvents.ts';
import type { SoundName, SoundPlayer, Voice } from './soundPlayer.ts';

const LAND_MIN_INTERVAL_MS = 40;
/** A restore reveals both groups at once and each reports its own end; they share one flourish */
const FLOURISH_MIN_INTERVAL_MS = 1500;
/** Semitones above the first chime (a minor arpeggio) */
const HERO_CHIME_STEPS = [0, 3, 7, 10, 12] as const;
const HERO_CHIME_BASE_RATE = 0.75;

let player: SoundPlayer | null = null;
let lastLandAt = Number.NEGATIVE_INFINITY;
let lastFlourishAt = Number.NEGATIVE_INFINITY;
let heroLandings = 0;

export function startSoundEffects(): () => void {
  const stopGestureWatch = loadOnFirstGesture();
  const unsubscribers = [
    onRollEvent('revealStart', ({ cards }) => {
      heroLandings = 0;

      if (cards > 0) {
        playDeal();
      }
    }),
    onRollEvent('cardLand', ({ kind }) => playLanding(kind)),
    onRollEvent('revealEnd', ({ cards }) => {
      if (cards > 0 && performance.now() - lastFlourishAt >= FLOURISH_MIN_INTERVAL_MS) {
        lastFlourishAt = performance.now();
        playFlourish();
      }

      // So a later single re-roll restarts the chime from its first note
      heroLandings = 0;
    }),
    useRandomizerStore.subscribe((state, previous) => {
      if (state.muted !== previous.muted) {
        applyMuted(state.muted);
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

export function playUiClick(): void {
  play('click', { volume: 0.32, rate: vary(1, 0.04) });
}

function playDeal(): void {
  play(Math.random() < 0.5 ? 'cardSlideA' : 'cardSlideB', {
    volume: vary(0.26, 0.15),
    rate: vary(1, 0.06),
  });
}

function playLanding(kind: CardKind): void {
  const now = performance.now();

  if (now - lastLandAt < LAND_MIN_INTERVAL_MS) {
    return;
  }

  lastLandAt = now;

  switch (kind) {
    case 'hero': {
      const step = HERO_CHIME_STEPS[Math.min(heroLandings, HERO_CHIME_STEPS.length - 1)] ?? 0;

      heroLandings += 1;
      play('cardPlace', { volume: 0.6, rate: vary(0.92, 0.03) });
      play('glass', { volume: 0.13, rate: HERO_CHIME_BASE_RATE * 2 ** (step / 12) });

      return;
    }
    case 'modifier': {
      play('cardPlace', { volume: 0.34, rate: vary(1.14, 0.05) });

      return;
    }
  }
}

function playFlourish(): void {
  play('bong', { volume: 0.34, rate: 0.68 });
  play('glass', { volume: 0.09, rate: 0.5 });
}

function play(name: SoundName, voice: Voice): void {
  player?.play(name, voice);
}

function vary(center: number, spread: number): number {
  return center * (1 + (Math.random() * 2 - 1) * spread);
}

function applyMuted(muted: boolean): void {
  // No audio context before loading; loadSounds applies the setting
  player?.setMuted(muted);
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
      player = createSoundPlayer(useRandomizerStore.getState().muted);
    })
    .catch(() => {
      // Sounds are optional, so a failed download leaves the app silent
    });
}
