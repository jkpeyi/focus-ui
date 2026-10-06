import { SegmentedControl, useTheme, type ThemeMode } from 'focus-ui';
import { Monitor, Moon, Sun } from 'lucide-react';

export default function Example() {
  const { mode, setMode, resolved } = useTheme();
  return (
    <div className="flex flex-col items-center gap-3">
      <SegmentedControl
        aria-label="Appearance"
        value={mode}
        onValueChange={(v) => setMode(v as ThemeMode)}
        options={[
          { value: 'light', label: 'Light', icon: <Sun /> },
          { value: 'dark', label: 'Dark', icon: <Moon /> },
          { value: 'system', label: 'Auto', icon: <Monitor /> },
        ]}
      />
      <span className="text-[13px] text-fg-muted">Currently rendering: {resolved}</span>
    </div>
  );
}
