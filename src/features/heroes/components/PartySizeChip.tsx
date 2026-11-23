import { useRandomizerStore } from '../../../store/useRandomizerStore.ts';
import { CountPicker } from '../../roll/components/CountPicker.tsx';
import { SettingsChip } from '../../roll/components/SettingsChip.tsx';
import { settingsLimits } from '../../roll/lib/roll.ts';

export function PartySizeChip() {
  const partySize = useRandomizerStore((state) => state.settings.partySize);
  const locks = useRandomizerStore((state) => state.locks);
  const setSettings = useRandomizerStore((state) => state.setSettings);

  return (
    <SettingsChip
      label="Party size"
      summary={partySize === 1 ? '1 hero' : `${partySize} heroes`}
      align="start"
    >
      <CountPicker
        label="Party size"
        value={partySize}
        limits={settingsLimits(locks).partySize}
        onChange={(size) => setSettings({ partySize: size })}
      />
    </SettingsChip>
  );
}
