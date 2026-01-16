'use client';

import { BlurSettings, AnimationUnit } from '@/types';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BlurRevealControlsProps {
  settings: BlurSettings;
  onChange: (settings: Partial<BlurSettings>) => void;
}

export function BlurRevealControls({ settings, onChange }: BlurRevealControlsProps) {
  return (
    <div className="space-y-4">
      {/* Start Blur */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Start Blur</Label>
          <span className="text-sm text-muted-foreground">{settings.startBlur}px</span>
        </div>
        <Slider
          min={0}
          max={30}
          step={1}
          value={[settings.startBlur]}
          onValueChange={([value]) => onChange({ startBlur: value })}
        />
      </div>

      {/* Start Opacity */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Start Opacity</Label>
          <span className="text-sm text-muted-foreground">{settings.startOpacity.toFixed(2)}</span>
        </div>
        <Slider
          min={0}
          max={1}
          step={0.05}
          value={[settings.startOpacity]}
          onValueChange={([value]) => onChange({ startOpacity: value })}
        />
      </div>

      {/* Y Offset */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Y Offset</Label>
          <span className="text-sm text-muted-foreground">{settings.yOffset}px</span>
        </div>
        <Slider
          min={0}
          max={30}
          step={1}
          value={[settings.yOffset]}
          onValueChange={([value]) => onChange({ yOffset: value })}
        />
      </div>

      {/* Animation Unit */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Animation Unit</Label>
        <Select
          value={settings.unit}
          onValueChange={(value) => onChange({ unit: value as AnimationUnit })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="char">Character</SelectItem>
            <SelectItem value="word">Word</SelectItem>
            <SelectItem value="line">Line</SelectItem>
          </SelectContent>
        </Select>
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
