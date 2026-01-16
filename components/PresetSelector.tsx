'use client';

import { PresetKey, PresetMeta } from '@/types';
import { cn } from '@/lib/utils';

interface PresetSelectorProps {
  presets: PresetMeta[];
  selected: PresetKey;
  onSelect: (preset: PresetKey) => void;
}

export function PresetSelector({
  presets,
  selected,
  onSelect,
}: PresetSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {presets.map((preset) => (
        <button
          key={preset.key}
          onClick={() => onSelect(preset.key)}
          className={cn(
            'flex flex-col items-start p-3 rounded-lg border text-left transition-colors',
            selected === preset.key
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          )}
        >
          <span className="text-sm font-medium">{preset.name}</span>
          <span className="text-xs text-muted-foreground">{preset.description}</span>
        </button>
      ))}
    </div>
  );
}
