'use client';

import { useMemo, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';
import { GlobalSettings, TypographySettings, BlurSettings } from '@/types';
import { splitText } from '@/lib/textSplit';
import { EASING_VALUES } from '@/lib/constants';

interface BlurRevealProps {
  text: string;
  global: GlobalSettings;
  typography: TypographySettings;
  settings: BlurSettings;
  animationKey: number;
  onComplete?: () => void;
}

export function BlurReveal({
  text,
  global,
  typography,
  settings,
  animationKey,
  onComplete,
}: BlurRevealProps) {
  const { chars, words } = useMemo(() => splitText(text), [text]);

  // Get easing value
  const easing = useMemo(() => {
    return EASING_VALUES[global.easing];
  }, [global.easing]);

  // Base animation variants
  const getVariants = useCallback((index: number): Variants => {
    const staggerDelay = (index * global.stagger) / 1000;
    const baseDuration = global.duration / 1000;

    return {
      hidden: {
        filter: `blur(${settings.startBlur}px)`,
        opacity: settings.startOpacity,
        y: settings.yOffset,
      },
      visible: {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
        transition: {
          duration: baseDuration,
          delay: (global.delay / 1000) + staggerDelay,
          ease: easing,
          ...(settings.overshoot && {
            type: 'spring',
            stiffness: 100,
            damping: 10,
          }),
        },
      },
    };
  }, [global.stagger, global.duration, global.delay, settings.startBlur, settings.startOpacity, settings.yOffset, settings.overshoot, easing]);

  // Render based on unit
  const renderContent = () => {
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

    if (settings.unit === 'word') {
      return (
        <span className="inline-flex flex-wrap">
          {words.map((word, index) => (
            <motion.span
              key={`${animationKey}-${index}`}
              variants={getVariants(index)}
              initial="hidden"
              animate="visible"
              onAnimationComplete={index === words.length - 1 ? onComplete : undefined}
              className="inline-block whitespace-pre"
            >
              {word}
            </motion.span>
          ))}
        </span>
      );
    }

    // char unit
    return (
      <span className="inline-flex flex-wrap">
        {chars.map((char, index) => (
          <motion.span
            key={`${animationKey}-${index}`}
            variants={getVariants(index)}
            initial="hidden"
            animate="visible"
            onAnimationComplete={index === chars.length - 1 ? onComplete : undefined}
            className="inline-block whitespace-pre"
            style={{
              minWidth: char === ' ' ? '0.25em' : undefined,
            }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    );
  };

  return renderContent();
}
