'use client';

import { FlipboardSettings } from '@/types';
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

interface FlipboardControlsProps {
  settings: FlipboardSettings;
  onChange: (settings: Partial<FlipboardSettings>) => void;
}

export function FlipboardControls({ settings, onChange }: FlipboardControlsProps) {
  return (
    <div className="space-y-4">
      {/* Alphabet */}
      <div className="space-y-2">
        <Label>Alphabet</Label>
        <Select
          value={settings.alphabet}
          onValueChange={(value: FlipboardSettings['alphabet']) =>
            onChange({ alphabet: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="uppercase">A-Z Uppercase</SelectItem>
            <SelectItem value="lowercase">a-z Lowercase</SelectItem>
            <SelectItem value="numbers">0-9 Numbers</SelectItem>
            <SelectItem value="full">Full Alphanumeric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Flips per character */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Flips per character</Label>
          <span className="text-sm text-muted-foreground">{settings.flipsPerChar}</span>
        </div>
        <Slider
          value={[settings.flipsPerChar]}
          min={3}
          max={15}
          step={1}
          onValueChange={([value]) => onChange({ flipsPerChar: value })}
        />
      </div>

      {/* Flip randomness */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Flip randomness</Label>
          <span className="text-sm text-muted-foreground">
            {Math.round(settings.flipRandomness * 100)}%
          </span>
        </div>
        <Slider
          value={[settings.flipRandomness]}
          min={0}
          max={1}
          step={0.05}
          onValueChange={([value]) => onChange({ flipRandomness: value })}
        />
      </div>

      {/* Card color */}
      <div className="space-y-2">
        <Label>Card color</Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={settings.cardColor}
            onChange={(e) => onChange({ cardColor: e.target.value })}
            className="w-10 h-10 rounded border border-border cursor-pointer"
          />
          <span className="text-sm text-muted-foreground">{settings.cardColor}</span>
        </div>
      </div>

      {/* Text color */}
      <div className="space-y-2">
        <Label>Text color</Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={settings.textColor}
            onChange={(e) => onChange({ textColor: e.target.value })}
            className="w-10 h-10 rounded border border-border cursor-pointer"
          />
          <span className="text-sm text-muted-foreground">{settings.textColor}</span>
        </div>
      </div>

      {/* Perspective */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>3D Perspective</Label>
          <span className="text-sm text-muted-foreground">{settings.perspective}px</span>
        </div>
        <Slider
          value={[settings.perspective]}
          min={200}
          max={1000}
          step={50}
          onValueChange={([value]) => onChange({ perspective: value })}
        />
      </div>

      {/* Show divider */}
      <div className="flex items-center justify-between">
        <Label>Show divider line</Label>
        <Switch
          checked={settings.showDivider}
          onCheckedChange={(checked) => onChange({ showDivider: checked })}
        />
      </div>
    </div>
  );
}
