import { Howl, Howler } from 'howler';

import bongMp3 from '../../../assets/sounds/bong_001.mp3';
import bongOgg from '../../../assets/sounds/bong_001.ogg';
import cardPlaceMp3 from '../../../assets/sounds/card-place-1.mp3';
import cardPlaceOgg from '../../../assets/sounds/card-place-1.ogg';
import cardSlideAMp3 from '../../../assets/sounds/card-slide-2.mp3';
import cardSlideAOgg from '../../../assets/sounds/card-slide-2.ogg';
import cardSlideBMp3 from '../../../assets/sounds/card-slide-3.mp3';
import cardSlideBOgg from '../../../assets/sounds/card-slide-3.ogg';
import clickMp3 from '../../../assets/sounds/click_001.mp3';
import clickOgg from '../../../assets/sounds/click_001.ogg';
import glassMp3 from '../../../assets/sounds/glass_001.mp3';
import glassOgg from '../../../assets/sounds/glass_001.ogg';

// MP3 is the fallback for browsers without Ogg (older Safari)
const SOURCES = {
  cardSlideA: [cardSlideAOgg, cardSlideAMp3],
  cardSlideB: [cardSlideBOgg, cardSlideBMp3],
  cardPlace: [cardPlaceOgg, cardPlaceMp3],
  glass: [glassOgg, glassMp3],
  bong: [bongOgg, bongMp3],
  click: [clickOgg, clickMp3],
} satisfies Record<string, readonly [ogg: string, mp3: string]>;

export type SoundName = keyof typeof SOURCES;

export interface Voice {
  readonly volume: number;
  readonly rate: number;
}

export interface SoundPlayer {
  play: (name: SoundName, voice: Voice) => void;
  setMuted: (muted: boolean) => void;
}

/** Loaded on the first user gesture, so howler and the sound files stay out of the main bundle */
export function createSoundPlayer(muted: boolean): SoundPlayer {
  const sounds: Record<SoundName, Howl> = {
    cardSlideA: createSound('cardSlideA'),
    cardSlideB: createSound('cardSlideB'),
    cardPlace: createSound('cardPlace'),
    glass: createSound('glass'),
    bong: createSound('bong'),
    click: createSound('click'),
  };

  Howler.mute(muted);

  return {
    play: (name, { volume, rate }) => {
      const sound = sounds[name];

      // Not loaded or failed: skip rather than queue, so a late sound never plays off the beat
      if (sound.state() !== 'loaded') {
        return;
      }

      const id = sound.play();

      sound.volume(volume, id);
      sound.rate(rate, id);
    },
    setMuted: (isMuted) => Howler.mute(isMuted),
  };
}

function createSound(name: SoundName): Howl {
  return new Howl({ src: [...SOURCES[name]], format: ['ogg', 'mp3'] });
}
