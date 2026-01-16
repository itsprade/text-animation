'use client';

import { GlobalSettings, EasingType } from '@/types';
import { EASING_OPTIONS } from '@/lib/constants';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GlobalControlsProps {
  settings: GlobalSettings;
  onChange: <K extends keyof GlobalSettings>(key: K, value: GlobalSettings[K]) => void;
  onRandomizeSeed: () => void;
}

export function GlobalControls({
  settings,
  onChange,
  onRandomizeSeed,
}: GlobalControlsProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Animation</Label>

      {/* Duration */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="duration" className="text-sm text-muted-foreground">Duration</Label>
          <span className="text-sm text-muted-foreground">{settings.duration}ms</span>
        </div>
        <Slider
          id="duration"
          min={100}
          max={3000}
          step={50}
          value={[settings.duration]}
          onValueChange={([value]) => onChange('duration', value)}
        />
      </div>

      {/* Stagger */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="stagger" className="text-sm text-muted-foreground">Stagger</Label>
          <span className="text-sm text-muted-foreground">{settings.stagger}ms</span>
        </div>
        <Slider
          id="stagger"
          min={0}
          max={200}
          step={5}
          value={[settings.stagger]}
          onValueChange={([value]) => onChange('stagger', value)}
        />
      </div>

      {/* Delay */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="delay" className="text-sm text-muted-foreground">Delay</Label>
          <span className="text-sm text-muted-foreground">{settings.delay}ms</span>
        </div>
        <Slider
          id="delay"
          min={0}
          max={2000}
          step={50}
          value={[settings.delay]}
          onValueChange={([value]) => onChange('delay', value)}
        />
      </div>

      {/* Easing */}
      <div className="space-y-2">
        <Label htmlFor="easing" className="text-sm text-muted-foreground">Easing</Label>
        <Select
          value={settings.easing}
          onValueChange={(value) => onChange('easing', value as EasingType)}
        >
          <SelectTrigger id="easing">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EASING_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Seed */}
      <div className="space-y-2">
        <Label htmlFor="seed" className="text-sm text-muted-foreground">Seed</Label>
        <div className="flex items-center gap-2">
          <Input
            id="seed"
            type="number"
            value={settings.seed}
            onChange={(e) => onChange('seed', parseInt(e.target.value) || 0)}
            className="flex-1"
          />
          <Button size="sm" variant="outline" onClick={onRandomizeSeed}>
            <DiceIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function DiceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
      <circle cx="16" cy="8" r="1" fill="currentColor" />
      <circle cx="8" cy="16" r="1" fill="currentColor" />
      <circle cx="16" cy="16" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}
