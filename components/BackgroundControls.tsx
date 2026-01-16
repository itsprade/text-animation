'use client';

import { BackgroundSetting, BackgroundType } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface BackgroundControlsProps {
  settings: BackgroundSetting;
  onChange: <K extends keyof BackgroundSetting>(key: K, value: BackgroundSetting[K]) => void;
}

const BACKGROUND_OPTIONS: { value: BackgroundType; label: string; preview: string }[] = [
  { value: 'transparent', label: 'Transparent', preview: 'bg-[conic-gradient(#e0e0e0_90deg,#fff_90deg_180deg,#e0e0e0_180deg_270deg,#fff_270deg)] bg-[length:10px_10px]' },
  { value: 'light', label: 'Light', preview: 'bg-white' },
  { value: 'dark', label: 'Dark', preview: 'bg-zinc-900' },
  { value: 'custom', label: 'Custom', preview: '' },
];

export function BackgroundControls({
  settings,
  onChange,
}: BackgroundControlsProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Background</Label>

      {/* Background Type */}
      <div className="grid grid-cols-4 gap-2">
        {BACKGROUND_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange('type', option.value)}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors',
              settings.type === option.value
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            )}
          >
            <div
              className={cn(
                'w-8 h-8 rounded border border-border',
                option.preview
              )}
              style={option.value === 'custom' ? { backgroundColor: settings.customColor } : undefined}
            />
            <span className="text-xs text-muted-foreground">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Custom Color Picker */}
      {settings.type === 'custom' && (
        <div className="space-y-2">
          <Label htmlFor="custom-color" className="text-sm text-muted-foreground">Custom Color</Label>
          <div className="flex items-center gap-2">
            <Input
              id="custom-color"
              type="color"
              value={settings.customColor}
              onChange={(e) => onChange('customColor', e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={settings.customColor}
              onChange={(e) => onChange('customColor', e.target.value)}
              className="flex-1 font-mono text-sm"
              placeholder="#ffffff"
            />
          </div>
        </div>
      )}
    </div>
  );
}
