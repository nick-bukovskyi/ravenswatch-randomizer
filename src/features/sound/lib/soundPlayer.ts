import { Howl, Howler } from 'howler';

import doubleKnockMp3 from '../../../assets/sounds/double-knock.mp3';
import doubleKnockOgg from '../../../assets/sounds/double-knock.ogg';
import inkSwellMp3 from '../../../assets/sounds/ink-swell.mp3';
import inkSwellOgg from '../../../assets/sounds/ink-swell.ogg';
import lowHitMp3 from '../../../assets/sounds/low-hit.mp3';
import lowHitOgg from '../../../assets/sounds/low-hit.ogg';
import switchTapMp3 from '../../../assets/sounds/switch-tap.mp3';
import switchTapOgg from '../../../assets/sounds/switch-tap.ogg';
import typewriterHitMp3 from '../../../assets/sounds/typewriter-hit.mp3';
import typewriterHitOgg from '../../../assets/sounds/typewriter-hit.ogg';
import woodClickMp3 from '../../../assets/sounds/wood-click.mp3';
import woodClickOgg from '../../../assets/sounds/wood-click.ogg';

/**
 * The files share one peak level (see CREDITS.md); `level` lowers the ones that still sound
 * louder, under the master volume. MP3 is the fallback for browsers without Ogg (older Safari)
 */
const SOURCES = {
  inkSwell: { files: [inkSwellOgg, inkSwellMp3], level: 0.4 },
  lowHit: { files: [lowHitOgg, lowHitMp3], level: 1 },
  woodClick: { files: [woodClickOgg, woodClickMp3], level: 1 },
  typewriterHit: { files: [typewriterHitOgg, typewriterHitMp3], level: 0.4 },
  switchTap: { files: [switchTapOgg, switchTapMp3], level: 0.6 },
  doubleKnock: { files: [doubleKnockOgg, doubleKnockMp3], level: 1 },
} satisfies Record<string, { files: readonly [ogg: string, mp3: string]; level: number }>;

export type SoundName = keyof typeof SOURCES;

export interface SoundPlayer {
  play: (name: SoundName, rate: number) => void;
  setVolume: (volume: number) => void;
}

/** Loaded on the first user gesture, so howler and the sound files stay out of the main bundle */
export function createSoundPlayer(volume: number): SoundPlayer {
  const sounds: Record<SoundName, Howl> = {
    inkSwell: createSound('inkSwell'),
    lowHit: createSound('lowHit'),
    woodClick: createSound('woodClick'),
    typewriterHit: createSound('typewriterHit'),
    switchTap: createSound('switchTap'),
    doubleKnock: createSound('doubleKnock'),
  };

  Howler.volume(volume);

  return {
    play: (name, rate) => {
      const sound = sounds[name];

      // Not loaded or failed: skip rather than queue, so a late sound never plays off the beat
      if (sound.state() !== 'loaded') {
        return;
      }

      sound.rate(rate, sound.play());
    },
    setVolume: (nextVolume) => Howler.volume(nextVolume),
  };
}

function createSound(name: SoundName): Howl {
  const { files, level } = SOURCES[name];

  return new Howl({ src: [...files], format: ['ogg', 'mp3'], volume: level });
}
