'use client';

import { useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { GlobalSettings, TypographySettings, MaskWipeSettings } from '@/types';
import { splitText } from '@/lib/textSplit';
import { EASING_VALUES } from '@/lib/constants';

interface MaskWipeProps {
  text: string;
  global: GlobalSettings;
  typography: TypographySettings;
  settings: MaskWipeSettings;
  animationKey: number;
  onComplete?: () => void;
}

// Get clip-path values based on direction
function getClipPath(direction: MaskWipeSettings['direction'], progress: 'start' | 'end') {
  // inset(top right bottom left)
  if (progress === 'start') {
    switch (direction) {
      case 'left': return 'inset(0 100% 0 0)';
      case 'right': return 'inset(0 0 0 100%)';
      case 'up': return 'inset(100% 0 0 0)';
      case 'down': return 'inset(0 0 100% 0)';
      default: return 'inset(0 100% 0 0)';
    }
  } else {
    return 'inset(0 0 0 0)';
  }
}

export function MaskWipe({
  text,
  global,
  typography: _typography,
  settings,
  animationKey,
  onComplete,
}: MaskWipeProps) {
  const { words } = useMemo(() => splitText(text), [text]);

  // Get easing value
  const easing = useMemo(() => {
    return EASING_VALUES[global.easing];
  }, [global.easing]);

  // Variants for mask wipe
  const getVariants = (index: number): Variants => {
    const staggerDelay = (index * global.stagger) / 1000;
    const baseDuration = global.duration / 1000;

    return {
      hidden: {
        clipPath: getClipPath(settings.direction, 'start'),
      },
      visible: {
        clipPath: getClipPath(settings.direction, 'end'),
        transition: {
          duration: baseDuration,
          delay: (global.delay / 1000) + staggerDelay,
          ease: easing as [number, number, number, number],
        },
      },
    };
  };

  // Render based on unit
  if (settings.unit === 'line') {
    return (
      <motion.span
        key={animationKey}
        variants={getVariants(0)}
        initial="hidden"
        animate="visible"
        onAnimationComplete={onComplete}
        className="inline-block"
      >
        {text}
      </motion.span>
    );
  }

  // Word unit
  const nonSpaceWords = words.filter(w => w !== ' ');
  const lastNonSpaceIndex = words.lastIndexOf(nonSpaceWords[nonSpaceWords.length - 1]);

  return (
    <span className="inline-flex flex-wrap">
      {words.map((word, index) => {
        // Spaces
        if (word === ' ') {
          return (
            <span key={`${animationKey}-${index}`} className="inline-block whitespace-pre">
              {word}
            </span>
          );
        }

        return (
          <motion.span
            key={`${animationKey}-${index}`}
            variants={getVariants(index)}
            initial="hidden"
            animate="visible"
            onAnimationComplete={index === lastNonSpaceIndex ? onComplete : undefined}
            className="inline-block"
          >
            {word}
          </motion.span>
        );
      })}
    </span>
  );
}
