import { cn } from '../../../shared/lib/cn.ts';
import { formatList, formatScorePercent, formatTimeAgo } from '../../../shared/lib/displayText.ts';
import { Icon } from '../../../shared/ui/Icon.tsx';
import type { HistoryEntry } from '../../../store/savedState.ts';
import { heroById } from '../../heroes/data/heroes.ts';
import { IconTile } from '../../modifiers/components/IconTile.tsx';
import { modifierById } from '../../modifiers/data/modifiers.ts';
import { DEFAULT_SETTINGS, scoreTotalPercent } from '../../roll/lib/roll.ts';
import { decodeShareQuery } from '../../share/lib/shareUrl.ts';

interface HistoryEntryButtonProps {
  entry: HistoryEntry;
  now: number;
  isShown: boolean;
  onRestore: (query: string) => void;
}

export function HistoryEntryButton({ entry, now, isShown, onRestore }: HistoryEntryButtonProps) {
  // Settings do not change how the cards look, so any fallback works
  const { result } = decodeShareQuery(entry.query, DEFAULT_SETTINGS);
  const rolledHeroes = result.heroIds.flatMap((id) => heroById.get(id) ?? []);
  const rolledModifiers = result.modifierIds.flatMap((id) => modifierById.get(id) ?? []);

  const timeAgo = formatTimeAgo(entry.timestamp, now);
  const score = formatScorePercent(scoreTotalPercent(result.modifierIds));
  const spokenCards = [
    rolledHeroes.length > 0 && formatList(rolledHeroes.map((hero) => hero.name)),
    rolledModifiers.length > 0 && formatList(rolledModifiers.map((modifier) => modifier.name)),
  ].filter((part) => part !== false);

  return (
    <button
      type="button"
      aria-label={`Restore roll, ${timeAgo}${isShown ? ', on screen now' : ''}: ${spokenCards.join('; ')}; score ${score}`}
      className={cn(
        'group/entry relative flex w-full flex-col gap-2.5 rounded-[10px] border bg-white/3 p-3 text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-[0_0_18px_-6px_--alpha(var(--color-gold-300)/55%)] active:translate-y-0 sm:p-3.5',
        isShown ? 'border-gold-700' : 'border-white/6',
      )}
      onClick={() => onRestore(entry.query)}
    >
      <span aria-hidden="true" className="flex items-center gap-3">
        <time
          dateTime={new Date(entry.timestamp).toISOString()}
          className="text-base leading-none tracking-wide whitespace-nowrap text-cream"
        >
          {timeAgo}
        </time>
        {isShown && (
          <span className="rounded-full border border-gold-700 px-2 pt-0.5 pb-px text-xs leading-none tracking-[0.12em] whitespace-nowrap text-gold-300 uppercase">
            On screen
          </span>
        )}
        <span className="ml-auto flex items-center gap-3">
          <span className="hidden items-center gap-1 text-xs tracking-[0.12em] text-gold-300 uppercase opacity-0 transition-opacity duration-200 group-hover/entry:opacity-100 group-focus-visible/entry:opacity-100 sm:flex [&_svg]:size-3.5">
            <Icon name="reroll" />
            Restore
          </span>
          <span className="text-base leading-none tracking-wide whitespace-nowrap text-cream-bright tabular-nums">
            Score {score}
          </span>
        </span>
      </span>

      <span aria-hidden="true" className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {rolledHeroes.length > 0 && (
          <span className="flex gap-1.5">
            {rolledHeroes.map((hero) => (
              <span
                key={hero.id}
                className="block size-11 overflow-hidden rounded-[3px] border border-gold-500 bg-night-deep shadow-[0_0_0_1px_var(--color-night-deep),0_4px_10px_-4px_rgb(0_0_0/0.9)] sm:size-12"
              >
                <img src={hero.portrait} alt="" className="size-full object-cover" />
              </span>
            ))}
          </span>
        )}
        {rolledModifiers.length > 0 && (
          <span className="flex flex-wrap gap-2 p-[3px]">
            {rolledModifiers.map((modifier) => (
              <IconTile
                key={modifier.id}
                icon={modifier.icon}
                polarity={modifier.polarity}
                className="w-7 sm:w-8"
              />
            ))}
          </span>
        )}
      </span>
    </button>
  );
}
