'use client';

import { WordSlideUpSettings } from '@/types';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface WordSlideUpControlsProps {
  settings: WordSlideUpSettings;
  onChange: (settings: Partial<WordSlideUpSettings>) => void;
}

export function WordSlideUpControls({ settings, onChange }: WordSlideUpControlsProps) {
  return (
    <div className="space-y-4">
      {/* Y Distance */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Y Distance</Label>
          <span className="text-sm text-muted-foreground">{settings.yDistance}px</span>
        </div>
        <Slider
          min={10}
          max={80}
          step={2}
          value={[settings.yDistance]}
          onValueChange={([value]) => onChange({ yDistance: value })}
        />
      </div>

      {/* Overshoot */}
      <div className="flex items-center justify-between">
        <Label className="text-sm text-muted-foreground">Overshoot</Label>
        <Switch
          checked={settings.overshoot}
          onCheckedChange={(checked) => onChange({ overshoot: checked })}
        />
      </div>
    </div>
  );
}
