'use client';

import { MaskWipeSettings, Direction } from '@/types';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MaskWipeControlsProps {
  settings: MaskWipeSettings;
  onChange: (settings: Partial<MaskWipeSettings>) => void;
}

export function MaskWipeControls({ settings, onChange }: MaskWipeControlsProps) {
  return (
    <div className="space-y-4">
      {/* Direction */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Direction</Label>
        <Select
          value={settings.direction}
          onValueChange={(value) => onChange({ direction: value as Direction })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left to Right</SelectItem>
            <SelectItem value="right">Right to Left</SelectItem>
            <SelectItem value="up">Bottom to Top</SelectItem>
            <SelectItem value="down">Top to Bottom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Animation Unit */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Animation Unit</Label>
        <Select
          value={settings.unit}
          onValueChange={(value) => onChange({ unit: value as 'word' | 'line' })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="word">Word</SelectItem>
            <SelectItem value="line">Line</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
