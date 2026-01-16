'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GlobalSettings, TypographySettings, UnderlineWipeSettings } from '@/types';
import { splitText } from '@/lib/textSplit';
import { EASING_VALUES } from '@/lib/constants';

interface UnderlineWipeProps {
  text: string;
  global: GlobalSettings;
  typography: TypographySettings;
  settings: UnderlineWipeSettings;
  animationKey: number;
  onComplete?: () => void;
}

export function UnderlineWipe({
  text,
  global,
  typography,
  settings,
  animationKey,
  onComplete,
}: UnderlineWipeProps) {
  const { words } = useMemo(() => splitText(text), [text]);
  const [underlineComplete, setUnderlineComplete] = useState(false);

  // Get easing value
  const easing = useMemo(() => {
    return EASING_VALUES[global.easing];
  }, [global.easing]);

  // Calculate durations
  const totalDuration = global.duration / 1000;
  const overlapFactor = settings.phaseOverlap / 100;

  // Underline takes first half (minus overlap)
  const underlineDuration = totalDuration * 0.5;
  // Text reveal starts at (underline duration - overlap)
  const textStartDelay = underlineDuration * (1 - overlapFactor);
  const textDuration = totalDuration - textStartDelay;

  // Underline animation
  const underlineVariants = {
    hidden: { scaleX: 0, originX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: underlineDuration,
        delay: global.delay / 1000,
        ease: easing as [number, number, number, number],
      },
    },
  };

  // Word animation
  const getWordVariants = (index: number) => {
    const wordDelay = (index * global.stagger) / 1000;
    return {
      hidden: { opacity: 0, y: 5 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: textDuration / words.filter(w => w !== ' ').length,
          delay: (global.delay / 1000) + textStartDelay + wordDelay,
          ease: easing as [number, number, number, number],
        },
      },
    };
  };

  // Filter non-space words for completion tracking
  const nonSpaceWords = words.filter(w => w !== ' ');
  const lastNonSpaceIndex = words.lastIndexOf(nonSpaceWords[nonSpaceWords.length - 1]);

  return (
    <span className="inline-block relative">
      {/* Text layer */}
      <span className="inline-flex flex-wrap">
        {words.map((word, index) => {
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
              variants={getWordVariants(index)}
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

      {/* Underline layer */}
      <motion.span
        key={`underline-${animationKey}`}
        variants={underlineVariants}
        initial="hidden"
        animate="visible"
        onAnimationComplete={() => setUnderlineComplete(true)}
        className="absolute left-0 right-0"
        style={{
          bottom: '-0.1em',
          height: `${settings.thickness}px`,
          backgroundColor: settings.underlineColor,
        }}
      />
    </span>
  );
}
