'use client';

import { ParticleBurstSettings } from '@/types';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ParticleBurstControlsProps {
  settings: ParticleBurstSettings;
  onChange: (settings: Partial<ParticleBurstSettings>) => void;
}

export function ParticleBurstControls({ settings, onChange }: ParticleBurstControlsProps) {
  return (
    <div className="space-y-4">
      {/* Particle Count */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Particle Count</Label>
          <span className="text-sm text-muted-foreground">{settings.particleCount}</span>
        </div>
        <Slider
          min={10}
          max={50}
          step={1}
          value={[settings.particleCount]}
          onValueChange={([value]) => onChange({ particleCount: value })}
        />
      </div>

      {/* Particle Size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Particle Size</Label>
          <span className="text-sm text-muted-foreground">{settings.particleSize}px</span>
        </div>
        <Slider
          min={2}
          max={8}
          step={1}
          value={[settings.particleSize]}
          onValueChange={([value]) => onChange({ particleSize: value })}
        />
      </div>

      {/* Burst Radius */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Burst Radius</Label>
          <span className="text-sm text-muted-foreground">{settings.burstRadius}px</span>
        </div>
        <Slider
          min={20}
          max={100}
          step={5}
          value={[settings.burstRadius]}
          onValueChange={([value]) => onChange({ burstRadius: value })}
        />
      </div>

      {/* Particle Color */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Particle Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={settings.particleColor}
            onChange={(e) => onChange({ particleColor: e.target.value })}
            className="w-12 h-9 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={settings.particleColor}
            onChange={(e) => onChange({ particleColor: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>

      {/* Burst Direction */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Burst Direction</Label>
        <Select
          value={settings.burstDirection}
          onValueChange={(value: 'outward' | 'inward') => onChange({ burstDirection: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outward">Outward</SelectItem>
            <SelectItem value="inward">Inward</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Fade Particles */}
      <div className="flex items-center justify-between">
        <Label className="text-sm text-muted-foreground">Fade Particles</Label>
        <Switch
          checked={settings.fadeParticles}
          onCheckedChange={(checked) => onChange({ fadeParticles: checked })}
        />
      </div>
    </div>
  );
}
