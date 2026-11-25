// Snapshot of the Custom Mode modifiers from the game files: definitions
// (Definitions/GameModifiers/*.gamemodifierdef), English text (ChallengesAndGameModifiers~GAM.xls)
// and icons (BC3 textures decoded to lossless WebP)
// IDs are part of the share URL contract: never change or reuse them

import lightFeetIcon from '../../../assets/modifiers/light-feet.webp';
import livingTheDreamIcon from '../../../assets/modifiers/living-the-dream.webp';
import quickLearnerIcon from '../../../assets/modifiers/quick-learner.webp';
import solidHeroesIcon from '../../../assets/modifiers/solid-heroes.webp';
import explorerIcon from '../../../assets/modifiers/explorer.webp';
import legacyIcon from '../../../assets/modifiers/legacy.webp';
import hyperactiveIcon from '../../../assets/modifiers/hyperactive.webp';
import rainOfStarsIcon from '../../../assets/modifiers/rain-of-stars.webp';
import eternalSunIcon from '../../../assets/modifiers/eternal-sun.webp';
import solarEclipseIcon from '../../../assets/modifiers/solar-eclipse.webp';
import singleChapterIcon from '../../../assets/modifiers/single-chapter.webp';
import invigoratingDeathIcon from '../../../assets/modifiers/invigorating-death.webp';
import inflationIcon from '../../../assets/modifiers/inflation.webp';
import lackOfInspirationIcon from '../../../assets/modifiers/lack-of-inspiration.webp';
import driedUpFountainsIcon from '../../../assets/modifiers/dried-up-fountains.webp';
import corruptionIcon from '../../../assets/modifiers/corruption.webp';
import diseaseIcon from '../../../assets/modifiers/disease.webp';
import bloodlustIcon from '../../../assets/modifiers/bloodlust.webp';
import angryBirdsIcon from '../../../assets/modifiers/angry-birds.webp';
import shadowyFogIcon from '../../../assets/modifiers/shadowy-fog.webp';
import oppressiveNightmareIcon from '../../../assets/modifiers/oppressive-nightmare.webp';
import berserkerFoesIcon from '../../../assets/modifiers/berserker-foes.webp';

export type ModifierPolarity = 'good' | 'bad';

interface ModifierData {
  readonly id: string;
  /** Game definition key */
  readonly key: string;
  readonly name: string;
  /** Lack of Inspiration and Oppressive Nightmare have small grammar fixes */
  readonly description: string;
  /** End-of-run score change in percent, from the game files */
  readonly scorePercent: number;
  /**
   * Never rolled together: from the game files, except Explorer and Oppressive Nightmare (Explorer
   * removes the boss timer that Oppressive Nightmare shortens)
   */
  readonly excludes: readonly string[];
  readonly icon: string;
}

const modifierData = [
  {
    id: 'lf',
    key: 'DashLowCooldown',
    name: 'Light Feet',
    description: 'DASH has a very small cooldown',
    scorePercent: -15,
    excludes: [],
    icon: lightFeetIcon,
  },
  {
    id: 'ld',
    key: 'DreamShardsAtStart',
    name: 'Living the Dream',
    description: 'Heroes start their adventure with 500 Dream Shards',
    scorePercent: -15,
    excludes: [],
    icon: livingTheDreamIcon,
  },
  {
    id: 'ql',
    key: 'MoreExperience',
    name: 'Quick Learner',
    description: '+50% XP gains',
    scorePercent: -15,
    excludes: [],
    icon: quickLearnerIcon,
  },
  {
    id: 'sh',
    key: 'MoreStartingHp',
    name: 'Solid Heroes',
    description: 'Heroes have +100% Max Health',
    scorePercent: -15,
    excludes: [],
    icon: solidHeroesIcon,
  },
  {
    id: 'ex',
    key: 'NoBossTimer',
    name: 'Explorer',
    description: 'No countdown before the Master Nightmare awakens',
    scorePercent: -15,
    excludes: ['on'],
    icon: explorerIcon,
  },
  {
    id: 'lg',
    key: 'OneLegendaryMOAtStart',
    name: 'Legacy',
    description: 'Heroes start their adventure with a choice of Legendary Object',
    scorePercent: -15,
    excludes: [],
    icon: legacyIcon,
  },
  {
    id: 'hy',
    key: 'OneMoreAbilityCharge',
    name: 'Hyperactive',
    description: 'Heroes have 1 extra POWER, SPECIAL and DEFENSE charge',
    scorePercent: -15,
    excludes: [],
    icon: hyperactiveIcon,
  },
  {
    id: 'rs',
    key: 'OnFreeReroll',
    name: 'Rain of Stars',
    description: 'The first reroll for any choice is free',
    scorePercent: -10,
    excludes: [],
    icon: rainOfStarsIcon,
  },
  {
    id: 'es',
    key: 'DayOnly',
    name: 'Eternal Sun',
    description: 'Play only during the day',
    scorePercent: -5,
    excludes: ['se'],
    icon: eternalSunIcon,
  },
  {
    id: 'se',
    key: 'NightOnly',
    name: 'Solar Eclipse',
    description: 'Play only at night',
    scorePercent: -5,
    excludes: ['es'],
    icon: solarEclipseIcon,
  },
  {
    id: 'ch',
    key: 'OneChapter',
    name: 'Single Chapter',
    description: 'Play a single random chapter',
    scorePercent: -5,
    excludes: [],
    icon: singleChapterIcon,
  },
  {
    id: 'id',
    key: 'EnemiesHealAtDeath',
    name: 'Invigorating Death',
    description: 'Enemies heal other nearby enemies when they die',
    scorePercent: 10,
    excludes: [],
    icon: invigoratingDeathIcon,
  },
  {
    id: 'in',
    key: 'HigherPrices',
    name: 'Inflation',
    description: '+100% to all Dream Shard costs',
    scorePercent: 10,
    excludes: [],
    icon: inflationIcon,
  },
  {
    id: 'li',
    key: 'LessChoices',
    name: 'Lack of Inspiration',
    description: '1 fewer offer for each choice of Talent or reward',
    scorePercent: 10,
    excludes: [],
    icon: lackOfInspirationIcon,
  },
  {
    id: 'df',
    key: 'NoFountains',
    name: 'Dried-up Fountains',
    description: 'Healing Fountains are empty',
    scorePercent: 10,
    excludes: [],
    icon: driedUpFountainsIcon,
  },
  {
    id: 'co',
    key: 'AllEnemiesTainted',
    name: 'Corruption',
    description: 'All enemies are Corrupted',
    scorePercent: 15,
    excludes: [],
    icon: corruptionIcon,
  },
  {
    id: 'di',
    key: 'LessHealing',
    name: 'Disease',
    description: 'Hero healing reduced by 50%',
    scorePercent: 15,
    excludes: [],
    icon: diseaseIcon,
  },
  {
    id: 'bl',
    key: 'LoseHpWhenNotInCombat',
    name: 'Bloodlust',
    description: 'Heroes lose HP equal to 1% of their Max Health for each second outside of combat',
    scorePercent: 15,
    excludes: [],
    icon: bloodlustIcon,
  },
  {
    id: 'ab',
    key: 'NoFeathers',
    name: 'Angry Birds',
    description: 'Heroes start with no Raven Feather, and none can be recovered',
    scorePercent: 15,
    excludes: [],
    icon: angryBirdsIcon,
  },
  {
    id: 'sf',
    key: 'NoMinimap',
    name: 'Shadowy Fog',
    description: 'The map is not displayed and cannot be used',
    scorePercent: 15,
    excludes: [],
    icon: shadowyFogIcon,
  },
  {
    id: 'on',
    key: 'OneLessDayNightCycle',
    name: 'Oppressive Nightmare',
    description: '1 fewer cycle before the Master Nightmare awakens',
    scorePercent: 15,
    excludes: ['ex'],
    icon: oppressiveNightmareIcon,
  },
  {
    id: 'bf',
    key: 'StrongerLowLifeEnemies',
    name: 'Berserker Foes',
    description: 'All enemies deal more damage the less health they have, up to +50%',
    scorePercent: 15,
    excludes: [],
    icon: berserkerFoesIcon,
  },
] as const satisfies readonly ModifierData[];

export type ModifierId = (typeof modifierData)[number]['id'];

export interface Modifier extends ModifierData {
  readonly id: ModifierId;
  readonly excludes: readonly ModifierId[];
  /** The game files have no polarity field, so it comes from the score sign */
  readonly polarity: ModifierPolarity;
}

export const modifiers: readonly Modifier[] = modifierData.map((modifier) => ({
  ...modifier,
  polarity: modifier.scorePercent < 0 ? 'good' : 'bad',
}));

/** Balanced mode only: at most `max` of these modifiers in one roll */
export const BALANCED_LIMITS: readonly {
  readonly ids: readonly ModifierId[];
  readonly max: number;
}[] = [
  // Living the Dream's free Dream Shards and Inflation's doubled costs cancel out
  { ids: ['ld', 'in'], max: 1 },
  // All three healing penalties together leave almost no healing; two still make a challenge
  { ids: ['di', 'df', 'bl'], max: 2 },
];

/** Keyed by string so untrusted share link codes can be looked up */
export const modifierById: ReadonlyMap<string, Modifier> = new Map(
  modifiers.map((modifier) => [modifier.id, modifier]),
);
