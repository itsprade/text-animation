'use client';

import { useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { GlobalSettings, TypographySettings, CharPopSettings } from '@/types';

interface CharPopProps {
  text: string;
  global: GlobalSettings;
  typography: TypographySettings;
  settings: CharPopSettings;
  animationKey: number;
  onComplete?: () => void;
}

export function CharPop({
  text,
  global,
  typography,
  settings,
  animationKey,
  onComplete,
}: CharPopProps) {
  const chars = useMemo(() => Array.from(text), [text]);

  // Character variants with spring animation
  const getVariants = (index: number): Variants => {
    const staggerDelay = (index * global.stagger) / 1000;

    return {
      hidden: {
        scale: settings.startScale,
        opacity: 0,
      },
      visible: {
        scale: 1,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: settings.springStiffness,
          damping: 15,
          delay: (global.delay / 1000) + staggerDelay,
        },
      },
    };
  };

  return (
    <span className="inline-flex flex-wrap">
      {chars.map((char, index) => {
        // Spaces are rendered but with simpler animation
        if (char === ' ') {
          return (
            <span
              key={`${animationKey}-${index}`}
              className="inline-block"
              style={{ width: '0.25em' }}
            >
              &nbsp;
            </span>
          );
        }

        return (
          <motion.span
            key={`${animationKey}-${index}`}
            variants={getVariants(index)}
            initial="hidden"
            animate="visible"
            onAnimationComplete={index === chars.length - 1 ? onComplete : undefined}
            className="inline-block origin-center"
          >
            {char}
          </motion.span>
        );
      })}
    </span>
  );
}
