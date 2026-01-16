'use client';

import { RollerSettings } from '@/types';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RollerBoardControlsProps {
  settings: RollerSettings;
  onChange: (settings: Partial<RollerSettings>) => void;
}

export function RollerBoardControls({ settings, onChange }: RollerBoardControlsProps) {
  return (
    <div className="space-y-4">
      {/* Alphabet */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Alphabet</Label>
        <Select
          value={settings.alphabet}
          onValueChange={(value) => onChange({ alphabet: value as RollerSettings['alphabet'] })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="uppercase">A-Z</SelectItem>
            <SelectItem value="lowercase">a-z</SelectItem>
            <SelectItem value="numbers">0-9</SelectItem>
            <SelectItem value="full">Full (A-Za-z0-9)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Spins */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Spins per Character</Label>
          <span className="text-sm text-muted-foreground">{settings.spins}</span>
        </div>
        <Slider
          min={1}
          max={10}
          step={1}
          value={[settings.spins]}
          onValueChange={([value]) => onChange({ spins: value })}
        />
      </div>

      {/* Spin Randomness */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Spin Randomness</Label>
          <span className="text-sm text-muted-foreground">{settings.spinRandomness.toFixed(2)}</span>
        </div>
        <Slider
          min={0}
          max={1}
          step={0.05}
          value={[settings.spinRandomness]}
          onValueChange={([value]) => onChange({ spinRandomness: value })}
        />
      </div>

      {/* Direction */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Direction</Label>
        <Select
          value={settings.direction}
          onValueChange={(value) => onChange({ direction: value as 'up' | 'down' })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="up">Up</SelectItem>
            <SelectItem value="down">Down</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
