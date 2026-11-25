import { useState } from 'react';

import avalon1280 from '../../assets/backgrounds/avalon-1280.webp';
import avalon1920 from '../../assets/backgrounds/avalon-1920.webp';
import avalon2560 from '../../assets/backgrounds/avalon-2560.webp';
import darkHills1280 from '../../assets/backgrounds/dark-hills-1280.webp';
import darkHills1920 from '../../assets/backgrounds/dark-hills-1920.webp';
import darkHills2560 from '../../assets/backgrounds/dark-hills-2560.webp';
import epilogue1280 from '../../assets/backgrounds/epilogue-1280.webp';
import epilogue1920 from '../../assets/backgrounds/epilogue-1920.webp';
import epilogue2560 from '../../assets/backgrounds/epilogue-2560.webp';
import keyArt1280 from '../../assets/backgrounds/key-art-1280.webp';
import keyArt1920 from '../../assets/backgrounds/key-art-1920.webp';
import stormIsland1280 from '../../assets/backgrounds/storm-island-1280.webp';
import stormIsland1920 from '../../assets/backgrounds/storm-island-1920.webp';
import stormIsland2560 from '../../assets/backgrounds/storm-island-2560.webp';
import { useIsClient } from '../../shared/hooks/useIsClient.ts';

interface Painting {
  readonly src: string;
  readonly srcSet: string;
}

/** Paintings decoded from the game files, resized from their 3840px originals */
const PAINTINGS: readonly [Painting, ...Painting[]] = [
  {
    src: stormIsland1920,
    srcSet: `${stormIsland1280} 1280w, ${stormIsland1920} 1920w, ${stormIsland2560} 2560w`,
  },
  { src: avalon1920, srcSet: `${avalon1280} 1280w, ${avalon1920} 1920w, ${avalon2560} 2560w` },
  {
    src: darkHills1920,
    srcSet: `${darkHills1280} 1280w, ${darkHills1920} 1920w, ${darkHills2560} 2560w`,
  },
  {
    src: epilogue1920,
    srcSet: `${epilogue1280} 1280w, ${epilogue1920} 1920w, ${epilogue2560} 2560w`,
  },
  { src: keyArt1920, srcSet: `${keyArt1280} 1280w, ${keyArt1920} 1920w` },
];

const painting = PAINTINGS[Math.floor(Math.random() * PAINTINGS.length)] ?? PAINTINGS[0];

export function Backdrop() {
  const isClient = useIsClient();

  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div aria-hidden="true" className="backdrop">
      {/* Client-only: the painting is random, and onLoad could miss a prerendered image */}
      {isClient && (
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
      )}
      <div className="backdrop__overlay" />
      <div className="backdrop__vignette" />
    </div>
  );
}
