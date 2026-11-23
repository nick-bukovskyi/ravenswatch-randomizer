import { useState } from 'react';

import avalonSmall from '../../assets/backgrounds/avalon-1920.webp';
import avalon from '../../assets/backgrounds/avalon.webp';
import darkHillsSmall from '../../assets/backgrounds/dark-hills-1920.webp';
import darkHills from '../../assets/backgrounds/dark-hills.webp';
import epilogueSmall from '../../assets/backgrounds/epilogue-1920.webp';
import epilogue from '../../assets/backgrounds/epilogue.webp';
import keyArt from '../../assets/backgrounds/key-art.webp';
import stormIslandSmall from '../../assets/backgrounds/storm-island-1920.webp';
import stormIsland from '../../assets/backgrounds/storm-island.webp';

interface Painting {
  readonly src: string;
  readonly srcSet?: string;
}

// Paintings decoded from the game files
const PAINTINGS: readonly [Painting, ...Painting[]] = [
  { src: stormIslandSmall, srcSet: `${stormIslandSmall} 1920w, ${stormIsland} 3840w` },
  { src: avalonSmall, srcSet: `${avalonSmall} 1920w, ${avalon} 3840w` },
  { src: darkHillsSmall, srcSet: `${darkHillsSmall} 1920w, ${darkHills} 3840w` },
  { src: epilogueSmall, srcSet: `${epilogueSmall} 1920w, ${epilogue} 3840w` },
  { src: keyArt },
];

const painting = PAINTINGS[Math.floor(Math.random() * PAINTINGS.length)] ?? PAINTINGS[0];

export function Backdrop() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div aria-hidden="true" className="backdrop">
      <img
        src={painting.src}
        srcSet={painting.srcSet}
        sizes="100vw"
        alt=""
        decoding="async"
        data-loaded={isLoaded}
        className="backdrop__art"
        onLoad={() => setIsLoaded(true)}
      />
      <div className="backdrop__overlay" />
      <div className="backdrop__vignette" />
    </div>
  );
}
