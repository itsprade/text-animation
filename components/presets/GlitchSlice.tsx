'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GlobalSettings, TypographySettings, GlitchSliceSettings } from '@/types';
import { createPRNG } from '@/lib/prng';
import { EASING_VALUES } from '@/lib/constants';

interface GlitchSliceProps {
  text: string;
  global: GlobalSettings;
  typography: TypographySettings;
  settings: GlitchSliceSettings;
  animationKey: number;
  onComplete?: () => void;
}

export function GlitchSlice({
  text,
  global,
  typography,
  settings,
  animationKey,
  onComplete,
}: GlitchSliceProps) {
  // Create deterministic random
  const random = useMemo(() => createPRNG(global.seed), [global.seed]);

  // Get easing value
  const easing = useMemo(() => {
    return EASING_VALUES[global.easing];
  }, [global.easing]);

  // Generate glitch keyframes
  const glitchKeyframes = useMemo(() => {
    const frames = [];
    const numFrames = Math.floor(settings.intensity * 8) + 2;

    for (let i = 0; i < numFrames; i++) {
      frames.push({
        x: (random() - 0.5) * settings.offsetAmount * 2,
        y: (random() - 0.5) * settings.offsetAmount,
      });
    }
    // End at 0
    frames.push({ x: 0, y: 0 });

    return frames;
  }, [settings.intensity, settings.offsetAmount, random]);

  // Calculate duration
  const duration = global.duration / 1000;
  const glitchDuration = duration * 0.7;
  const settleDuration = duration * 0.3;

  // Layer colors for RGB effect
  const layerColors = settings.colorSeparation
    ? ['rgba(255, 0, 0, 0.8)', 'rgba(0, 255, 0, 0.8)', 'rgba(0, 0, 255, 0.8)']
    : ['currentColor', 'currentColor', 'currentColor'];

  // Layer offsets
  const layerOffsets = settings.colorSeparation
    ? [
        { x: -settings.offsetAmount, y: 0 },
        { x: settings.offsetAmount, y: 0 },
        { x: 0, y: 0 },
      ]
    : [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ];

  // Main animation variants
  const mainVariants = {
    hidden: {
      opacity: 0,
      x: glitchKeyframes[0]?.x || 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: duration,
        delay: global.delay / 1000,
        ease: easing as [number, number, number, number],
      },
    },
  };

  // Glitch layer variants
  const getGlitchVariants = (layerIndex: number) => {
    const offset = layerOffsets[layerIndex];
    const baseOffset = settings.colorSeparation ? offset.x : 0;

    return {
      hidden: {
        x: baseOffset + glitchKeyframes[0]?.x || 0,
        opacity: settings.colorSeparation ? 0.8 : 0,
      },
      glitch: {
        x: [
          ...glitchKeyframes.map(f => baseOffset + f.x),
          baseOffset,
          0,
        ],
        opacity: [
          ...glitchKeyframes.map(() => settings.colorSeparation ? 0.6 : 0.3),
          settings.colorSeparation ? 0.3 : 0.1,
          0,
        ],
        transition: {
          duration: glitchDuration,
          delay: global.delay / 1000,
          times: glitchKeyframes.map((_, i) => i / (glitchKeyframes.length + 1)).concat([
            (glitchKeyframes.length) / (glitchKeyframes.length + 1),
            1,
          ]),
        },
      },
    };
  };

  return (
    <span className="relative inline-block">
      {/* Glitch layers (behind) */}
      {settings.colorSeparation && layerColors.slice(0, 2).map((color, layerIndex) => (
        <motion.span
          key={`${animationKey}-layer-${layerIndex}`}
          variants={getGlitchVariants(layerIndex)}
          initial="hidden"
          animate="glitch"
          className="absolute inset-0 pointer-events-none"
          style={{
            color: color,
            mixBlendMode: 'screen',
          }}
          aria-hidden="true"
        >
          {text}
        </motion.span>
      ))}

      {/* Main text layer */}
      <motion.span
        key={animationKey}
        variants={mainVariants}
        initial="hidden"
        animate="visible"
        onAnimationComplete={onComplete}
        className="relative inline-block"
      >
        {text}
      </motion.span>
    </span>
  );
}
