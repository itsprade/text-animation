'use client';

import { GlitchSliceSettings } from '@/types';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface GlitchSliceControlsProps {
  settings: GlitchSliceSettings;
  onChange: (settings: Partial<GlitchSliceSettings>) => void;
}

export function GlitchSliceControls({ settings, onChange }: GlitchSliceControlsProps) {
  return (
    <div className="space-y-4">
      {/* Intensity */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Intensity</Label>
          <span className="text-sm text-muted-foreground">{settings.intensity.toFixed(2)}</span>
        </div>
        <Slider
          min={0}
          max={1}
          step={0.05}
          value={[settings.intensity]}
          onValueChange={([value]) => onChange({ intensity: value })}
        />
      </div>

      {/* Offset Amount */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Offset Amount</Label>
          <span className="text-sm text-muted-foreground">{settings.offsetAmount}px</span>
        </div>
        <Slider
          min={1}
          max={15}
          step={1}
          value={[settings.offsetAmount]}
          onValueChange={([value]) => onChange({ offsetAmount: value })}
        />
      </div>

      {/* Color Separation */}
      <div className="flex items-center justify-between">
        <Label className="text-sm text-muted-foreground">Color Separation</Label>
        <Switch
          checked={settings.colorSeparation}
          onCheckedChange={(checked) => onChange({ colorSeparation: checked })}
        />
      </div>
    </div>
  );
}
