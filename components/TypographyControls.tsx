'use client';

import { TypographySettings, FontFamily } from '@/types';
import { FONT_OPTIONS } from '@/lib/constants';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TypographyControlsProps {
  settings: TypographySettings;
  onChange: <K extends keyof TypographySettings>(key: K, value: TypographySettings[K]) => void;
}

export function TypographyControls({
  settings,
  onChange,
}: TypographyControlsProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Typography</Label>

      {/* Font Family */}
      <div className="space-y-2">
        <Label htmlFor="font-family" className="text-sm text-muted-foreground">Font Family</Label>
        <Select
          value={settings.fontFamily}
          onValueChange={(value) => onChange('fontFamily', value as FontFamily)}
        >
          <SelectTrigger id="font-family">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="font-size" className="text-sm text-muted-foreground">Font Size</Label>
          <span className="text-sm text-muted-foreground">{settings.fontSize}px</span>
        </div>
        <Slider
          id="font-size"
          min={16}
          max={120}
          step={2}
          value={[settings.fontSize]}
          onValueChange={([value]) => onChange('fontSize', value)}
        />
      </div>

      {/* Font Weight */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="font-weight" className="text-sm text-muted-foreground">Font Weight</Label>
          <span className="text-sm text-muted-foreground">{settings.fontWeight}</span>
        </div>
        <Slider
          id="font-weight"
          min={100}
          max={900}
          step={100}
          value={[settings.fontWeight]}
          onValueChange={([value]) => onChange('fontWeight', value)}
        />
      </div>

      {/* Letter Spacing */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="letter-spacing" className="text-sm text-muted-foreground">Letter Spacing</Label>
          <span className="text-sm text-muted-foreground">{settings.letterSpacing}em</span>
        </div>
        <Slider
          id="letter-spacing"
          min={-0.1}
          max={0.3}
          step={0.01}
          value={[settings.letterSpacing]}
          onValueChange={([value]) => onChange('letterSpacing', value)}
        />
      </div>

      {/* Line Height */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="line-height" className="text-sm text-muted-foreground">Line Height</Label>
          <span className="text-sm text-muted-foreground">{settings.lineHeight}</span>
        </div>
        <Slider
          id="line-height"
          min={0.8}
          max={2}
          step={0.1}
          value={[settings.lineHeight]}
          onValueChange={([value]) => onChange('lineHeight', value)}
        />
      </div>

      {/* Text Transform */}
      <div className="space-y-2">
        <Label htmlFor="text-transform" className="text-sm text-muted-foreground">Text Transform</Label>
        <Select
          value={settings.textTransform}
          onValueChange={(value) => onChange('textTransform', value as 'none' | 'uppercase')}
        >
          <SelectTrigger id="text-transform">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="uppercase">Uppercase</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
