'use client';

import { ScrambleSettings, CharsetMode, RevealMode } from '@/types';
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

interface ScrambleControlsProps {
  settings: ScrambleSettings;
  onChange: (settings: Partial<ScrambleSettings>) => void;
}

export function ScrambleControls({ settings, onChange }: ScrambleControlsProps) {
  return (
    <div className="space-y-4">
      {/* Character Set Mode */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Character Set</Label>
        <Select
          value={settings.charsetMode}
          onValueChange={(value) => onChange({ charsetMode: value as CharsetMode })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="special">Special chars only</SelectItem>
            <SelectItem value="alphanumeric">Alphanumeric + special</SelectItem>
          </SelectContent>
        </Select>
      </div>

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

      {/* Steps */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Steps</Label>
          <span className="text-sm text-muted-foreground">{settings.steps}</span>
        </div>
        <Slider
          min={1}
          max={50}
          step={1}
          value={[settings.steps]}
          onValueChange={([value]) => onChange({ steps: value })}
        />
      </div>

      {/* Reveal Mode */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Reveal Mode</Label>
        <Select
          value={settings.revealMode}
          onValueChange={(value) => onChange({ revealMode: value as RevealMode })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ltr">Left to Right</SelectItem>
            <SelectItem value="rtl">Right to Left</SelectItem>
            <SelectItem value="center">Center Out</SelectItem>
            <SelectItem value="random">Random</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Preserve Spaces */}
      <div className="flex items-center justify-between">
        <Label className="text-sm text-muted-foreground">Preserve Spaces</Label>
        <Switch
          checked={settings.preserveSpaces}
          onCheckedChange={(checked) => onChange({ preserveSpaces: checked })}
        />
      </div>

      {/* Preserve Punctuation */}
      <div className="flex items-center justify-between">
        <Label className="text-sm text-muted-foreground">Preserve Punctuation</Label>
        <Switch
          checked={settings.preservePunctuation}
          onCheckedChange={(checked) => onChange({ preservePunctuation: checked })}
        />
      </div>
    </div>
  );
}
