// Images came through its HTTPS image proxy, converted to WebP at native size
// IDs are part of the share URL contract: never change or reuse them

import scarletPortrait from '../../../assets/heroes/scarlet-portrait.webp';
import scarletPortraitBw from '../../../assets/heroes/scarlet-portrait-bw.webp';
import scarletIllustration from '../../../assets/heroes/scarlet-illustration.webp';
import scarletIllustrationSmall from '../../../assets/heroes/scarlet-illustration-480.webp';
import thePiedPiperPortrait from '../../../assets/heroes/the-pied-piper-portrait.webp';
import thePiedPiperPortraitBw from '../../../assets/heroes/the-pied-piper-portrait-bw.webp';
import thePiedPiperIllustration from '../../../assets/heroes/the-pied-piper-illustration.webp';
import thePiedPiperIllustrationSmall from '../../../assets/heroes/the-pied-piper-illustration-480.webp';
import beowulfPortrait from '../../../assets/heroes/beowulf-portrait.webp';
import beowulfPortraitBw from '../../../assets/heroes/beowulf-portrait-bw.webp';
import beowulfIllustration from '../../../assets/heroes/beowulf-illustration.webp';
import beowulfIllustrationSmall from '../../../assets/heroes/beowulf-illustration-480.webp';
import theSnowQueenPortrait from '../../../assets/heroes/the-snow-queen-portrait.webp';
import theSnowQueenPortraitBw from '../../../assets/heroes/the-snow-queen-portrait-bw.webp';
import theSnowQueenIllustration from '../../../assets/heroes/the-snow-queen-illustration.webp';
import theSnowQueenIllustrationSmall from '../../../assets/heroes/the-snow-queen-illustration-480.webp';
import aladdinPortrait from '../../../assets/heroes/aladdin-portrait.webp';
import aladdinPortraitBw from '../../../assets/heroes/aladdin-portrait-bw.webp';
import aladdinIllustration from '../../../assets/heroes/aladdin-illustration.webp';
import aladdinIllustrationSmall from '../../../assets/heroes/aladdin-illustration-480.webp';
import melusinePortrait from '../../../assets/heroes/melusine-portrait.webp';
import melusinePortraitBw from '../../../assets/heroes/melusine-portrait-bw.webp';
import melusineIllustration from '../../../assets/heroes/melusine-illustration.webp';
import melusineIllustrationSmall from '../../../assets/heroes/melusine-illustration-480.webp';
import geppettoPortrait from '../../../assets/heroes/geppetto-portrait.webp';
import geppettoPortraitBw from '../../../assets/heroes/geppetto-portrait-bw.webp';
import geppettoIllustration from '../../../assets/heroes/geppetto-illustration.webp';
import geppettoIllustrationSmall from '../../../assets/heroes/geppetto-illustration-480.webp';
import sunWukongPortrait from '../../../assets/heroes/sun-wukong-portrait.webp';
import sunWukongPortraitBw from '../../../assets/heroes/sun-wukong-portrait-bw.webp';
import sunWukongIllustration from '../../../assets/heroes/sun-wukong-illustration.webp';
import sunWukongIllustrationSmall from '../../../assets/heroes/sun-wukong-illustration-480.webp';
import carmillaPortrait from '../../../assets/heroes/carmilla-portrait.webp';
import carmillaPortraitBw from '../../../assets/heroes/carmilla-portrait-bw.webp';
import carmillaIllustration from '../../../assets/heroes/carmilla-illustration.webp';
import carmillaIllustrationSmall from '../../../assets/heroes/carmilla-illustration-480.webp';
import romeoPortrait from '../../../assets/heroes/romeo-portrait.webp';
import romeoPortraitBw from '../../../assets/heroes/romeo-portrait-bw.webp';
import romeoIllustration from '../../../assets/heroes/romeo-illustration.webp';
import romeoIllustrationSmall from '../../../assets/heroes/romeo-illustration-480.webp';
import julietPortrait from '../../../assets/heroes/juliet-portrait.webp';
import julietPortraitBw from '../../../assets/heroes/juliet-portrait-bw.webp';
import julietIllustration from '../../../assets/heroes/juliet-illustration.webp';
import julietIllustrationSmall from '../../../assets/heroes/juliet-illustration-480.webp';
import merlinPortrait from '../../../assets/heroes/merlin-portrait.webp';
import merlinPortraitBw from '../../../assets/heroes/merlin-portrait-bw.webp';
import merlinIllustration from '../../../assets/heroes/merlin-illustration.webp';
import merlinIllustrationSmall from '../../../assets/heroes/merlin-illustration-480.webp';
import kintaroPortrait from '../../../assets/heroes/kintaro-portrait.webp';
import kintaroPortraitBw from '../../../assets/heroes/kintaro-portrait-bw.webp';
import kintaroIllustration from '../../../assets/heroes/kintaro-illustration.webp';
import kintaroIllustrationSmall from '../../../assets/heroes/kintaro-illustration-480.webp';

/** Tuned per hero by eye: the art sits left of center and is cut at its left edge */
interface ArtFocus {
  /** Image-width fraction placed at the card center */
  readonly x: number;
  /** Image-height fraction placed at the card top; negative adds space above */
  readonly y: number;
  /** Image width in card widths */
  readonly zoom: number;
}

interface HeroData {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly portrait: string;
  readonly portraitBw: string;
  /** 800px wide */
  readonly illustration: string;
  /** 480px wide, for screens that do not need the full size */
  readonly illustrationSmall: string;
  readonly artFocus: ArtFocus;
}

const heroData = [
  {
    id: 'sc',
    name: 'Scarlet',
    description:
      "Scarlet discovered she was cursed with lycanthropy while covered in her grandmother's remains. The Little Red of legend grew up in the blink of two very big eyes. A revenge-seeking hunter by day, wielding an arsenal of knives and the occasional bomb, at night she is a brutal monster whose pounce is just as mean as her bite. Oh, what big claws she has.",
    portrait: scarletPortrait,
    portraitBw: scarletPortraitBw,
    illustration: scarletIllustration,
    illustrationSmall: scarletIllustrationSmall,
    artFocus: { x: 0.5, y: 0, zoom: 1 },
  },
  {
    id: 'pp',
    name: 'The Pied Piper',
    description:
      "Once the greatest musician of his generation until cursed by Nightmares, Franz the Pied Piper's songs have become distorted melodies of mass destruction, only pleasant to the ears of the rats that gather round him. When overwhelmed, the critters can be called to the rescue, unleashing a swarm of gnashing teeth.",
    portrait: thePiedPiperPortrait,
    portraitBw: thePiedPiperPortraitBw,
    illustration: thePiedPiperIllustration,
    illustrationSmall: thePiedPiperIllustrationSmall,
    artFocus: { x: 0.38, y: 0, zoom: 1.15 },
  },
  {
    id: 'bw',
    name: 'Beowulf',
    description:
      "Beowulf's renown was earned slaying the vile Grendel, Grendel's mother, and a dragon. Honour-bound to raise the spawn of his cursed victim, he trains his drake pup ward in the arts of war. Together a gruesome pair, the sword-and-shield warrior and the toddling fire breather are a force to be feared, even by Nightmares. Their bark is hotter than their bite.",
    portrait: beowulfPortrait,
    portraitBw: beowulfPortraitBw,
    illustration: beowulfIllustration,
    illustrationSmall: beowulfIllustrationSmall,
    artFocus: { x: 0.45, y: 0, zoom: 1.15 },
  },
  {
    id: 'sq',
    name: 'The Snow Queen',
    description:
      'Once loved by her people as a warm and caring sovereign sorceress, Nyss left and joined the Ravenswatch when Nightmares corrupted her healing powers, making her touch deadly and her gaze bitter. The Snow Queen freezes enemies at a distance before crushing them with destructive spells. Nothing shatters more completely than a monster turned to ice.',
    portrait: theSnowQueenPortrait,
    portraitBw: theSnowQueenPortraitBw,
    illustration: theSnowQueenIllustration,
    illustrationSmall: theSnowQueenIllustrationSmall,
    artFocus: { x: 0.4, y: 0, zoom: 1.15 },
  },
  {
    id: 'al',
    name: 'Aladdin',
    description:
      "Once a happy-go-lucky thief until his happily-ever-after princess got stuck in a lamp, Aladdin now pledges his rogue skills to the protection of Reverie. A master thief, sporting formidable magical powers from his ring and lamp, Aladdin makes for quite the sneaky and unpredictable guardian. Funny things can happen on the way to one's potential.",
    portrait: aladdinPortrait,
    portraitBw: aladdinPortraitBw,
    illustration: aladdinIllustration,
    illustrationSmall: aladdinIllustrationSmall,
    artFocus: { x: 0.4, y: 0, zoom: 1.15 },
  },
  {
    id: 'me',
    name: 'Melusine',
    description:
      "Melusine was already a dangerous siren before the Nightmares impregnated her with a mysterious child. She uses powerful water magic and charming song to summon will-o-wisps to drown anyone with plans to harm her precious cargo. Melusine's atypical fighting style is unsettling to behold. Monsters, fill your ears with wax, lest the melodious mother fill your lungs with brine.",
    portrait: melusinePortrait,
    portraitBw: melusinePortraitBw,
    illustration: melusineIllustration,
    illustrationSmall: melusineIllustrationSmall,
    artFocus: { x: 0.48, y: 0, zoom: 1.15 },
  },
  {
    id: 'ge',
    name: 'Geppetto',
    description:
      "After losing his son to Nightmares, Geppetto set his mind to the invention of deadly automatons: squadrons of killing machines, messengers of booming doom. The once-upon-a-time puppet maker now works to bring about the destruction of the horrors invading Reverie as efficiently as possible. Geppetto's minions know no fear and never tell lies.",
    portrait: geppettoPortrait,
    portraitBw: geppettoPortraitBw,
    illustration: geppettoIllustration,
    illustrationSmall: geppettoIllustrationSmall,
    artFocus: { x: 0.42, y: 0, zoom: 1.15 },
  },
  {
    id: 'wu',
    name: 'Sun Wukong',
    description:
      "Sun Wukong, the Monkey King and Heaven's Equal, lost his power of immortality during a great celebration at the hands of uninvited Nightmares. Still formidable, he relies on his alternating postures, embracing a balanced strategy of Yin and Yang to pound out all ideas of resistance from his foolish foes. One should expect no less from a god.",
    portrait: sunWukongPortrait,
    portraitBw: sunWukongPortraitBw,
    illustration: sunWukongIllustration,
    illustrationSmall: sunWukongIllustrationSmall,
    artFocus: { x: 0.54, y: 0, zoom: 1.15 },
  },
  {
    id: 'ca',
    name: 'Carmilla',
    description:
      'Separated from the love of her eternal life in the war against darkness, Carmilla now fights to extinguish those she holds responsible for destroying her happily-ever-after. She is a dhampir, a day-walking vampire, drinking blood to strengthen her powers while taking care to control the monster within. Carmilla is physically fast and ferocious – but her wit also has fangs of its own.',
    portrait: carmillaPortrait,
    portraitBw: carmillaPortraitBw,
    illustration: carmillaIllustration,
    illustrationSmall: carmillaIllustrationSmall,
    artFocus: { x: 0.41, y: 0, zoom: 1.15 },
  },
  {
    id: 'ro',
    name: 'Romeo',
    description:
      'Awakening every day with no memories of the day before, Romeo still remembers that he is in love with Juliet who quickly informs him that they are intrepid agents of the Ravenswatch. Quick with his rapier and quicker with his verse, the legendary hero of clan Montague is most powerful when marrying his skills with his equally deadly paramour.',
    portrait: romeoPortrait,
    portraitBw: romeoPortraitBw,
    illustration: romeoIllustration,
    illustrationSmall: romeoIllustrationSmall,
    artFocus: { x: 0.5, y: 0, zoom: 1.15 },
  },
  {
    id: 'ju',
    name: 'Juliet',
    description:
      'Juliet\'s dreams of happily-ever-after were dashed when Romeo awakened, unable to form new memories, and "\'til death do us part" took on a whole new meaning. Determined to make the most of their second shot at love, Juliet has honed her skills so her shooting is as devastating as her beauty.',
    portrait: julietPortrait,
    portraitBw: julietPortraitBw,
    illustration: julietIllustration,
    illustrationSmall: julietIllustrationSmall,
    artFocus: { x: 0.42, y: 0, zoom: 1.15 },
  },
  {
    id: 'mr',
    name: 'Merlin',
    description:
      "Merlin's mysterious release from his eternal prison cell has him now using his wizardly magic to obliterate the darkness clouding both Reverie and his own mind. Bereft of his powers of prophecy, he relies on his druidly elemental powers to clear the world of monsters and find the missing Lady of the Lake.",
    portrait: merlinPortrait,
    portraitBw: merlinPortraitBw,
    illustration: merlinIllustration,
    illustrationSmall: merlinIllustrationSmall,
    artFocus: { x: 0.37, y: 0, zoom: 1.15 },
  },
  {
    id: 'ki',
    name: 'Kintarō',
    description:
      'Kintarō and his bear Kuma were sent from their mountain home to deliver a message to the witch Baba Yaga. Kintarō fights wildly, joyfully, and without mercy. Kuma fights because he is very, very hungry.\nTogether, these brothers from the forest are formidable wardens. But even when dismounted, Kintaro is a ferocious warrior, and Kuma a mountain that moves.',
    portrait: kintaroPortrait,
    portraitBw: kintaroPortraitBw,
    illustration: kintaroIllustration,
    illustrationSmall: kintaroIllustrationSmall,
    artFocus: { x: 0.42, y: -0.02, zoom: 1.3 },
  },
] as const satisfies readonly HeroData[];

export type HeroId = (typeof heroData)[number]['id'];

export interface Hero extends HeroData {
  readonly id: HeroId;
}

export const heroes: readonly Hero[] = heroData;

/** Keyed by string so untrusted share link codes can be looked up */
export const heroById: ReadonlyMap<string, Hero> = new Map(heroes.map((hero) => [hero.id, hero]));
