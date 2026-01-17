'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalSettings, TypographySettings, SparkleTrailSettings } from '@/types';
import { createPRNG } from '@/lib/prng';
import { EASING_VALUES } from '@/lib/constants';

interface SparkleTrailProps {
  text: string;
  global: GlobalSettings;
  typography: TypographySettings;
  settings: SparkleTrailSettings;
  animationKey: number;
  onComplete?: () => void;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  twinkleDelay: number;
}

const SPARKLE_COLORS = [
  '#fbbf24', // amber
  '#f472b6', // pink
  '#60a5fa', // blue
  '#34d399', // green
  '#a78bfa', // purple
  '#fb7185', // rose
  '#fcd34d', // yellow
];

export function SparkleTrail({
  text,
  global,
  typography: _typography,
  settings,
  animationKey,
  onComplete,
}: SparkleTrailProps) {
  const chars = useMemo(() => Array.from(text), [text]);
  const [visibleChars, setVisibleChars] = useState<boolean[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[][]>([]);
  const completedRef = useRef(0);
  const [key, setKey] = useState(animationKey);

  // Reset on animation key change
  useEffect(() => {
    completedRef.current = 0;
    setKey(animationKey);
    setVisibleChars(new Array(chars.length).fill(false));

    // Generate sparkles for each character
    const random = createPRNG(global.seed);
    const allSparkles: Sparkle[][] = chars.map((char, charIndex) => {
      if (char === ' ') return [];

      const charSparkles: Sparkle[] = [];
      for (let i = 0; i < settings.sparkleCount; i++) {
        // Spread sparkles around the character
        const x = (random() - 0.5) * 40;
        const y = (random() - 0.5) * 30;
        const color = settings.randomColors
          ? SPARKLE_COLORS[Math.floor(random() * SPARKLE_COLORS.length)]
          : settings.sparkleColor;

        charSparkles.push({
          id: i,
          x,
          y,
          size: settings.sparkleSize * (0.5 + random() * 0.5),
          color,
          delay: (i / settings.sparkleCount) * 0.3,
          twinkleDelay: random() * 0.5,
        });
      }
      return charSparkles;
    });
    setSparkles(allSparkles);

    // Reveal characters with stagger
    const revealTimeouts: NodeJS.Timeout[] = [];
    chars.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleChars(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, global.delay + index * global.stagger);
      revealTimeouts.push(timeout);
    });

    return () => {
      revealTimeouts.forEach(clearTimeout);
    };
  }, [animationKey, chars, global.seed, global.delay, global.stagger, settings.sparkleCount, settings.sparkleSize, settings.sparkleColor, settings.randomColors]);

  const easing = useMemo(() => EASING_VALUES[global.easing], [global.easing]);
  const duration = global.duration / 1000;

  // Handle character animation complete
  const handleCharComplete = (index: number) => {
    completedRef.current++;
    if (completedRef.current === chars.filter(c => c !== ' ').length) {
      setTimeout(() => onComplete?.(), 100);
    }
  };

  // Star/sparkle SVG path
  const StarSparkle = ({ size, color }: { size: number; color: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
    </svg>
  );

  return (
    <span className="inline-flex flex-wrap relative">
      {chars.map((char, index) => {
        if (char === ' ') {
          return (
            <span
              key={`${key}-${index}`}
              className="inline-block"
              style={{ width: '0.25em' }}
            >
              &nbsp;
            </span>
          );
        }

        const charSparkles = sparkles[index] || [];
        const isVisible = visibleChars[index];

        return (
          <span
            key={`${key}-${index}`}
            className="inline-block relative"
          >
            {/* Sparkles */}
            <AnimatePresence>
              {isVisible && charSparkles.map((sparkle) => (
                <motion.span
                  key={`sparkle-${sparkle.id}`}
                  className="absolute pointer-events-none"
                  style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: sparkle.x - sparkle.size / 2,
                    marginTop: sparkle.y - sparkle.size / 2,
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0,
                    rotate: 0,
                  }}
                  animate={{
                    opacity: settings.twinkle
                      ? [0, 1, 0.5, 1, 0.3, 1, 0]
                      : [0, 1, 1, 0],
                    scale: [0, 1.2, 1, 1.1, 1, 0.8, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: duration * settings.trailLength * 0.5,
                    delay: sparkle.delay + sparkle.twinkleDelay,
                    ease: 'easeInOut',
                  }}
                >
                  <StarSparkle size={sparkle.size} color={sparkle.color} />
                </motion.span>
              ))}
            </AnimatePresence>

            {/* Character */}
            <motion.span
              className="inline-block relative z-10"
              initial={{
                opacity: 0,
                y: 10,
                filter: 'brightness(1)',
              }}
              animate={isVisible ? {
                opacity: 1,
                y: 0,
                filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'],
              } : {
                opacity: 0,
                y: 10,
              }}
              transition={{
                duration: duration * 0.4,
                ease: easing as [number, number, number, number],
              }}
              onAnimationComplete={() => isVisible && handleCharComplete(index)}
            >
              {char}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
