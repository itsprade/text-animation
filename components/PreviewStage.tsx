'use client';

import { useMemo } from 'react';
import { AppState, AnimationState } from '@/types';
import { FONT_OPTIONS } from '@/lib/constants';
import { Scramble } from './presets/Scramble';
import { BlurReveal } from './presets/BlurReveal';
import { RollerBoard } from './presets/RollerBoard';
import { WordSlideUp } from './presets/WordSlideUp';
import { CharPop } from './presets/CharPop';
import { MaskWipe } from './presets/MaskWipe';
import { UnderlineWipe } from './presets/UnderlineWipe';
import { GlitchSlice } from './presets/GlitchSlice';
import { ParticleBurst } from './presets/ParticleBurst';
import { SparkleTrail } from './presets/SparkleTrail';

interface PreviewStageProps {
  state: AppState;
  animationKey: number;
  animationState: AnimationState;
  onComplete: () => void;
}

export function PreviewStage({
  state,
  animationKey,
  animationState,
  onComplete,
}: PreviewStageProps) {
  // Get background color
  const backgroundColor = useMemo(() => {
    switch (state.background.type) {
      case 'transparent':
        return 'transparent';
      case 'light':
        return '#ffffff';
      case 'dark':
        return '#0a0a0a';
      case 'custom':
        return state.background.customColor;
      default:
        return 'transparent';
    }
  }, [state.background]);

  // Get text color based on background
  const textColor = useMemo(() => {
    if (state.background.type === 'dark') {
      return '#ffffff';
    }
    return '#0a0a0a';
  }, [state.background.type]);

  // Get font family CSS variable
  const fontFamily = useMemo(() => {
    const font = FONT_OPTIONS.find(f => f.value === state.typography.fontFamily);
    return font?.variable || 'var(--font-inter)';
  }, [state.typography.fontFamily]);

  // Checkerboard pattern for transparent background
  const checkerboardStyle = state.background.type === 'transparent' ? {
    backgroundImage: `
      linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
      linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
      linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)
    `,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
  } : {};

  // Render the active preset
  const renderPreset = () => {
    const commonProps = {
      text: state.text,
      global: state.global,
      typography: state.typography,
      animationKey,
      onComplete,
    };

    switch (state.preset) {
      case 'scramble':
        return <Scramble {...commonProps} settings={state.scramble} />;
      case 'blur':
        return <BlurReveal {...commonProps} settings={state.blur} />;
      case 'roller':
        return <RollerBoard {...commonProps} settings={state.roller} />;
      case 'wordSlideUp':
        return <WordSlideUp {...commonProps} settings={state.wordSlideUp} />;
      case 'charPop':
        return <CharPop {...commonProps} settings={state.charPop} />;
      case 'maskWipe':
        return <MaskWipe {...commonProps} settings={state.maskWipe} />;
      case 'underlineWipe':
        return <UnderlineWipe {...commonProps} settings={state.underlineWipe} />;
      case 'glitchSlice':
        return <GlitchSlice {...commonProps} settings={state.glitchSlice} />;
      case 'particleBurst':
        return <ParticleBurst {...commonProps} settings={state.particleBurst} />;
      case 'sparkleTrail':
        return <SparkleTrail {...commonProps} settings={state.sparkleTrail} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="h-full w-full flex items-center justify-center p-8"
      style={checkerboardStyle}
    >
      <div
        className="flex items-center justify-center p-12 rounded-lg min-w-[300px]"
        style={{ backgroundColor }}
      >
        <div
          className="text-center max-w-4xl"
          style={{
            fontFamily,
            fontSize: `${state.typography.fontSize}px`,
            fontWeight: state.typography.fontWeight,
            letterSpacing: `${state.typography.letterSpacing}em`,
            lineHeight: state.typography.lineHeight,
            textTransform: state.typography.textTransform,
            color: textColor,
          }}
          aria-label={state.text}
        >
          {renderPreset()}
        </div>
      </div>
    </div>
  );
}
