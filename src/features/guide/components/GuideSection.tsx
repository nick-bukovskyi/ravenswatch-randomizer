import { Ornament } from '../../../shared/ui/Ornament.tsx';
import { faq } from '../data/faq.ts';
import { FaqItem } from './FaqItem.tsx';

export function GuideSection() {
  return (
    <div className="mt-16 max-[560px]:mt-12">
      <Ornament className="mx-auto mb-12 max-w-xs" />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-12 min-[900px]:grid-cols-2 min-[900px]:gap-16">
        <section className="font-body text-lg leading-relaxed text-cream-muted">
          <h2 className="mb-4 font-display text-[24px] leading-tight tracking-[0.05em] text-cream-bright uppercase text-engraved">
            What is the Ravenswatch Randomizer?
          </h2>
          <p className="mb-4">
            Can&apos;t decide who to play? Let the ravens choose. The Ravenswatch Randomizer picks a
            random hero for every player, solo or in co-op, plus random Custom Mode modifiers that
            bend the rules of the Nightmare. No more arguing over who gets Scarlet.
          </p>
          <p>
            Every roll shows how its modifiers change your end-of-run score. Like part of a roll?
            Lock those cards and roll again, or re-roll a single card. Never want to see a hero or
            modifier? <b className="font-medium text-gold-300">Ban</b> it from its card, or open the
            ban list in its panel. Press{' '}
            <kbd className="font-body font-medium text-gold-300">H</kbd> or{' '}
            <kbd className="font-body font-medium text-gold-300">M</kbd> to roll without the mouse,
            and use <b className="font-medium text-gold-300">Share</b> to send the exact run to your
            party.
          </p>
        </section>

        <section>
          <h2 className="mb-1 text-[24px] leading-tight tracking-[0.05em] text-cream-bright uppercase text-engraved">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-gold-700/35">
            {faq.map((entry) => (
              <FaqItem key={entry.question} entry={entry} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
