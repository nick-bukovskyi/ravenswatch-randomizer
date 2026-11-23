import corruptionIcon from '../../../assets/modifiers/corruption.webp';
import solidHeroesIcon from '../../../assets/modifiers/solid-heroes.webp';
import { RadioGroup } from '../../../shared/ui/RadioGroup.tsx';
import { Tooltip } from '../../../shared/ui/Tooltip.tsx';
import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import { CountPicker } from '../../roll/components/CountPicker.tsx';
import { SettingsChip } from '../../roll/components/SettingsChip.tsx';
import { MODIFIER_SELECTORS, settingsLimits, type ModifierSelector } from '../../roll/lib/roll.ts';
import { IconTile } from './IconTile.tsx';
import { SplitTile } from './SplitTile.tsx';

const SELECTOR_LABELS: Record<ModifierSelector, string> = {
  good: 'Good',
  bad: 'Bad',
  both: 'Both',
};

const SELECTOR_HINTS: Record<ModifierSelector, string> = {
  good: 'Good: easier run, lower score',
  bad: 'Bad: harder run, higher score',
  both: 'Both: a mix of good and bad',
};

export function ModifierSettingsChip() {
  const settings = useRandomizerStore((state) => state.settings);
  const locks = useRandomizerStore((state) => state.locks);
  const setSettings = useRandomizerStore((state) => state.setSettings);

  return (
    <SettingsChip
      label="Modifier settings"
      summary={`${settings.modifierCount} · ${SELECTOR_LABELS[settings.selector]}`}
      align="end"
      icon={
        <span
          aria-hidden="true"
          data-selector={settings.selector}
          className="modifier-settings-chip__swatch"
        />
      }
      className="w-[min(340px,calc(100vw_-_28px))]"
    >
      <RadioGroup label="Modifier type" className="grid grid-cols-3 gap-2">
        {MODIFIER_SELECTORS.map((selector) => {
          const isChecked = selector === settings.selector;

          return (
            <Tooltip key={selector} content={SELECTOR_HINTS[selector]}>
              <button
                type="button"
                role="radio"
                aria-checked={isChecked}
                tabIndex={isChecked ? 0 : -1}
                className="flex cursor-pointer flex-col items-center gap-[18px] rounded-xl bg-white/3 px-1 pt-3.5 pb-3 transition-[background-color,transform] duration-200 ease-game hover:-translate-y-0.5 hover:bg-white/8 aria-checked:bg-white/10 aria-checked:shadow-[inset_0_0_0_1px_var(--color-gold-500)]"
                onClick={() => setSettings({ selector })}
              >
                {selector === 'good' && (
                  <IconTile icon={solidHeroesIcon} polarity="good" className="w-[54px]" />
                )}
                {selector === 'bad' && (
                  <IconTile icon={corruptionIcon} polarity="bad" className="w-[54px]" />
                )}
                {selector === 'both' && (
                  <SplitTile
                    goodIcon={solidHeroesIcon}
                    badIcon={corruptionIcon}
                    className="w-[54px]"
                  />
                )}
                <span className="text-[17px] leading-none text-cream-bright">
                  {SELECTOR_LABELS[selector]}
                </span>
              </button>
            </Tooltip>
          );
        })}
      </RadioGroup>
      <CountPicker
        label="Modifier count"
        value={settings.modifierCount}
        limits={settingsLimits(locks).modifierCount}
        onChange={(count) => setSettings({ modifierCount: count })}
      />
    </SettingsChip>
  );
}
