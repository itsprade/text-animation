'use client';

import { SparkleTrailSettings } from '@/types';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

interface SparkleTrailControlsProps {
  settings: SparkleTrailSettings;
  onChange: (settings: Partial<SparkleTrailSettings>) => void;
}

export function SparkleTrailControls({ settings, onChange }: SparkleTrailControlsProps) {
  return (
    <div className="space-y-4">
      {/* Sparkle Count */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Sparkle Count</Label>
          <span className="text-sm text-muted-foreground">{settings.sparkleCount}</span>
        </div>
        <Slider
          min={5}
          max={30}
          step={1}
          value={[settings.sparkleCount]}
          onValueChange={([value]) => onChange({ sparkleCount: value })}
        />
      </div>

      {/* Sparkle Size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Sparkle Size</Label>
          <span className="text-sm text-muted-foreground">{settings.sparkleSize}px</span>
        </div>
        <Slider
          min={2}
          max={8}
          step={1}
          value={[settings.sparkleSize]}
          onValueChange={([value]) => onChange({ sparkleSize: value })}
        />
      </div>

      {/* Trail Length */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Trail Length</Label>
          <span className="text-sm text-muted-foreground">{settings.trailLength}</span>
        </div>
        <Slider
          min={1}
          max={5}
          step={0.5}
          value={[settings.trailLength]}
          onValueChange={([value]) => onChange({ trailLength: value })}
        />
      </div>

      {/* Sparkle Color (only shown when randomColors is off) */}
      {!settings.randomColors && (
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Sparkle Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={settings.sparkleColor}
              onChange={(e) => onChange({ sparkleColor: e.target.value })}
              className="w-12 h-9 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={settings.sparkleColor}
              onChange={(e) => onChange({ sparkleColor: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>
      )}

      {/* Random Colors */}
      <div className="flex items-center justify-between">
        <Label className="text-sm text-muted-foreground">Random Colors</Label>
        <Switch
          checked={settings.randomColors}
          onCheckedChange={(checked) => onChange({ randomColors: checked })}
        />
      </div>

      {/* Twinkle */}
      <div className="flex items-center justify-between">
        <Label className="text-sm text-muted-foreground">Twinkle Effect</Label>
        <Switch
          checked={settings.twinkle}
          onCheckedChange={(checked) => onChange({ twinkle: checked })}
        />
      </div>
    </div>
  );
}
