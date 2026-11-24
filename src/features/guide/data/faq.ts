import { modifiers, type ModifierPolarity } from '../../modifiers/data/modifiers.ts';
import { MAX_PARTY_SIZE } from '../../roll/lib/roll.ts';

export interface FaqEntry {
  readonly question: string;
  readonly answer: string;
}

export const faq: readonly FaqEntry[] = [
  {
    question: 'How many players can play Ravenswatch co-op?',
    answer: `Up to ${MAX_PARTY_SIZE}. Set the party size to match your group and every player gets a different hero. Lock the heroes your friends already picked and roll only the rest.`,
  },
  {
    question: 'What do Custom Mode modifiers do?',
    answer: `Custom Mode lets you change the rules of a run with ${modifiers.length} modifiers. Good modifiers are bonuses, like Light Feet, which gives your dash a very short cooldown. Bad modifiers are maluses that make the Nightmare fight harder, like Berserker Foes, whose enemies hit harder as their health drops. Roll good ones, bad ones or a mix.`,
  },
  {
    question: 'How do modifiers change my score?',
    answer: `Each good modifier lowers your end-of-run score by ${scoreRange('good')}, and each bad one raises it by ${scoreRange('bad')}. The randomizer adds up the total for every roll, so you know the score change before the run starts.`,
  },
  {
    question: 'Do modifiers disable achievements?',
    answer:
      'Yes. Runs with modifiers do not unlock achievements, difficulties or outfits. You still unlock new heroes, as the developers have confirmed.',
  },
  {
    question: 'Is this an official Ravenswatch tool?',
    answer:
      'No. It is a free fan-made tool. It is not affiliated with Passtech Games or Nacon, the developer and publisher of Ravenswatch.',
  },
];

function scoreRange(polarity: ModifierPolarity): string {
  const sizes = modifiers
    .filter((modifier) => modifier.polarity === polarity)
    .map((modifier) => Math.abs(modifier.scorePercent));

  return `${Math.min(...sizes)}% to ${Math.max(...sizes)}%`;
}
