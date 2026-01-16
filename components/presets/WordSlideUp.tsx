'use client';

import { useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { GlobalSettings, TypographySettings, WordSlideUpSettings } from '@/types';
import { splitText } from '@/lib/textSplit';
import { EASING_VALUES } from '@/lib/constants';

interface WordSlideUpProps {
  text: string;
  global: GlobalSettings;
  typography: TypographySettings;
  settings: WordSlideUpSettings;
  animationKey: number;
  onComplete?: () => void;
}

export function WordSlideUp({
  text,
  global,
  typography,
  settings,
  animationKey,
  onComplete,
}: WordSlideUpProps) {
  const { words } = useMemo(() => splitText(text), [text]);

  // Get easing value
  const easing = useMemo(() => {
    return EASING_VALUES[global.easing];
  }, [global.easing]);

  // Word variants
  const getVariants = (index: number): Variants => {
    const staggerDelay = (index * global.stagger) / 1000;
    const baseDuration = global.duration / 1000;

    if (settings.overshoot) {
      return {
        hidden: {
          y: settings.yDistance,
          opacity: 0,
        },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 200,
            damping: 20,
            delay: (global.delay / 1000) + staggerDelay,
          },
        },
      };
    }

    return {
      hidden: {
        y: settings.yDistance,
        opacity: 0,
      },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: baseDuration,
          delay: (global.delay / 1000) + staggerDelay,
          ease: easing,
        },
      },
    };
  };

  // Filter out space-only words for animation tracking
  const nonSpaceWords = words.filter(w => w !== ' ');
  const lastNonSpaceIndex = words.lastIndexOf(nonSpaceWords[nonSpaceWords.length - 1]);

  return (
    <span className="inline-flex flex-wrap overflow-hidden">
      {words.map((word, index) => {
        // Spaces are rendered but not animated
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
