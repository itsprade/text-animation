'use client';

import { UnderlineWipeSettings } from '@/types';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface UnderlineWipeControlsProps {
  settings: UnderlineWipeSettings;
  onChange: (settings: Partial<UnderlineWipeSettings>) => void;
}

export function UnderlineWipeControls({ settings, onChange }: UnderlineWipeControlsProps) {
  return (
    <div className="space-y-4">
      {/* Underline Color */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Underline Color</Label>
        <div className="flex items-center gap-2">
          <Input
            type="color"
            value={settings.underlineColor}
            onChange={(e) => onChange({ underlineColor: e.target.value })}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={settings.underlineColor}
            onChange={(e) => onChange({ underlineColor: e.target.value })}
            className="flex-1 font-mono text-sm"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Thickness */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Thickness</Label>
          <span className="text-sm text-muted-foreground">{settings.thickness}px</span>
        </div>
        <Slider
          min={1}
          max={8}
          step={1}
          value={[settings.thickness]}
          onValueChange={([value]) => onChange({ thickness: value })}
        />
      </div>

      {/* Phase Overlap */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Phase Overlap</Label>
          <span className="text-sm text-muted-foreground">{settings.phaseOverlap}%</span>
        </div>
        <Slider
          min={0}
          max={100}
          step={5}
          value={[settings.phaseOverlap]}
          onValueChange={([value]) => onChange({ phaseOverlap: value })}
        />
      </div>
    </div>
  );
}
