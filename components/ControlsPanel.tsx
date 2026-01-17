'use client';

import { AppState, AnimationState, PresetKey } from '@/types';
import { MAX_TEXT_LENGTH, PRESET_META } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PlayControls } from './PlayControls';
import { GlobalControls } from './GlobalControls';
import { TypographyControls } from './TypographyControls';
import { BackgroundControls } from './BackgroundControls';
import { PresetSelector } from './PresetSelector';
import { ScrambleControls } from './PresetControls/ScrambleControls';
import { BlurRevealControls } from './PresetControls/BlurRevealControls';
import { RollerBoardControls } from './PresetControls/RollerBoardControls';
import { FlipboardControls } from './PresetControls/FlipboardControls';
import { WordSlideUpControls } from './PresetControls/WordSlideUpControls';
import { CharPopControls } from './PresetControls/CharPopControls';
import { MaskWipeControls } from './PresetControls/MaskWipeControls';
import { UnderlineWipeControls } from './PresetControls/UnderlineWipeControls';
import { GlitchSliceControls } from './PresetControls/GlitchSliceControls';
import { ParticleBurstControls } from './PresetControls/ParticleBurstControls';
import { SparkleTrailControls } from './PresetControls/SparkleTrailControls';

interface ControlsPanelProps {
  state: AppState;
  animationState: AnimationState;
  updateState: <K extends keyof AppState>(key: K, value: AppState[K]) => void;
  updateGlobal: <K extends keyof AppState['global']>(key: K, value: AppState['global'][K]) => void;
  updateTypography: <K extends keyof AppState['typography']>(key: K, value: AppState['typography'][K]) => void;
  updateBackground: <K extends keyof AppState['background']>(key: K, value: AppState['background'][K]) => void;
  updatePresetSettings: <K extends PresetKey>(preset: K, settings: Partial<AppState[K]>) => void;
  play: () => void;
  replay: () => void;
  pause: () => void;
  resume: () => void;
  randomizeSeed: () => void;
}

export function ControlsPanel({
  state,
  animationState,
  updateState,
  updateGlobal,
  updateTypography,
  updateBackground,
  updatePresetSettings,
  play,
  replay,
  pause,
  resume,
  randomizeSeed,
}: ControlsPanelProps) {
  // Render preset-specific controls
  const renderPresetControls = () => {
    switch (state.preset) {
      case 'scramble':
        return (
          <ScrambleControls
            settings={state.scramble}
            onChange={(settings) => updatePresetSettings('scramble', settings)}
          />
        );
      case 'blur':
        return (
          <BlurRevealControls
            settings={state.blur}
            onChange={(settings) => updatePresetSettings('blur', settings)}
          />
        );
      case 'roller':
        return (
          <RollerBoardControls
            settings={state.roller}
            onChange={(settings) => updatePresetSettings('roller', settings)}
          />
        );
      case 'flipboard':
        return (
          <FlipboardControls
            settings={state.flipboard}
            onChange={(settings) => updatePresetSettings('flipboard', settings)}
          />
        );
      case 'wordSlideUp':
        return (
          <WordSlideUpControls
            settings={state.wordSlideUp}
            onChange={(settings) => updatePresetSettings('wordSlideUp', settings)}
          />
        );
      case 'charPop':
        return (
          <CharPopControls
            settings={state.charPop}
            onChange={(settings) => updatePresetSettings('charPop', settings)}
          />
        );
      case 'maskWipe':
        return (
          <MaskWipeControls
            settings={state.maskWipe}
            onChange={(settings) => updatePresetSettings('maskWipe', settings)}
          />
        );
      case 'underlineWipe':
        return (
          <UnderlineWipeControls
            settings={state.underlineWipe}
            onChange={(settings) => updatePresetSettings('underlineWipe', settings)}
          />
        );
      case 'glitchSlice':
        return (
          <GlitchSliceControls
            settings={state.glitchSlice}
            onChange={(settings) => updatePresetSettings('glitchSlice', settings)}
          />
        );
      case 'particleBurst':
        return (
          <ParticleBurstControls
            settings={state.particleBurst}
            onChange={(settings) => updatePresetSettings('particleBurst', settings)}
          />
        );
      case 'sparkleTrail':
        return (
          <SparkleTrailControls
            settings={state.sparkleTrail}
            onChange={(settings) => updatePresetSettings('sparkleTrail', settings)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 pb-8 space-y-6">
      {/* Text Input */}
      <div className="space-y-2">
        <Label htmlFor="text-input">Title Text</Label>
        <Input
          id="text-input"
          value={state.text}
          onChange={(e) => updateState('text', e.target.value.slice(0, MAX_TEXT_LENGTH))}
          placeholder="Enter your title..."
          maxLength={MAX_TEXT_LENGTH}
        />
        <p className="text-xs text-muted-foreground">
          {state.text.length}/{MAX_TEXT_LENGTH} characters
        </p>
      </div>

      <Separator />

      {/* Preset Selector */}
      <div className="space-y-2">
        <Label>Animation Preset</Label>
        <PresetSelector
          presets={PRESET_META}
          selected={state.preset}
          onSelect={(preset) => updateState('preset', preset)}
        />
      </div>

      <Separator />

      {/* Play Controls */}
      <PlayControls
        animationState={animationState}
        loop={state.global.loop}
        onLoopChange={(loop) => updateGlobal('loop', loop)}
        play={play}
        replay={replay}
        pause={pause}
        resume={resume}
      />

      <Separator />

      {/* Global Controls */}
      <GlobalControls
        settings={state.global}
        onChange={updateGlobal}
        onRandomizeSeed={randomizeSeed}
      />

      <Separator />

      {/* Preset-specific Controls */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          {PRESET_META.find(p => p.key === state.preset)?.name} Settings
        </Label>
        {renderPresetControls()}
      </div>

      <Separator />

      {/* Typography Controls */}
      <TypographyControls
        settings={state.typography}
        onChange={updateTypography}
      />

      <Separator />

      {/* Background Controls */}
      <BackgroundControls
        settings={state.background}
        onChange={updateBackground}
      />
    </div>
  );
}
