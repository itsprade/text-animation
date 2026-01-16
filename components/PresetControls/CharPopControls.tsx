'use client';

import { CharPopSettings } from '@/types';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface CharPopControlsProps {
  settings: CharPopSettings;
  onChange: (settings: Partial<CharPopSettings>) => void;
}

export function CharPopControls({ settings, onChange }: CharPopControlsProps) {
  return (
    <div className="space-y-4">
      {/* Start Scale */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Start Scale</Label>
          <span className="text-sm text-muted-foreground">{settings.startScale.toFixed(2)}</span>
        </div>
        <Slider
          min={0.5}
          max={0.95}
          step={0.05}
          value={[settings.startScale]}
          onValueChange={([value]) => onChange({ startScale: value })}
        />
      </div>

      {/* Spring Stiffness */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Spring Stiffness</Label>
          <span className="text-sm text-muted-foreground">{settings.springStiffness}</span>
        </div>
        <Slider
          min={100}
          max={500}
          step={25}
          value={[settings.springStiffness]}
          onValueChange={([value]) => onChange({ springStiffness: value })}
        />
      </div>
    </div>
  );
}
