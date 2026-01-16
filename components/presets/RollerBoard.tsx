'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlobalSettings, TypographySettings, RollerSettings } from '@/types';
import { createPRNG } from '@/lib/prng';
import { ROLLER_ALPHABETS, EASING_VALUES } from '@/lib/constants';

interface RollerBoardProps {
  text: string;
  global: GlobalSettings;
  typography: TypographySettings;
  settings: RollerSettings;
  animationKey: number;
  onComplete?: () => void;
}

interface ColumnData {
  target: string;
  stack: string[];
  spins: number;
}

export function RollerBoard({
  text,
  global,
  typography,
  settings,
  animationKey,
  onComplete,
}: RollerBoardProps) {
  const chars = useMemo(() => Array.from(text), [text]);
  const completedRef = useRef(0);
  const [key, setKey] = useState(animationKey);

  // Reset on animation key change
  useEffect(() => {
    completedRef.current = 0;
    setKey(animationKey);
  }, [animationKey]);

  // Get alphabet
  const alphabet = useMemo(() => {
    return ROLLER_ALPHABETS[settings.alphabet];
  }, [settings.alphabet]);

  // Generate column data
  const columns = useMemo((): ColumnData[] => {
    const random = createPRNG(global.seed);
    const alphabetChars = alphabet.split('');

    return chars.map((char, index) => {
      // Space - no animation
      if (char === ' ') {
        return { target: ' ', stack: [' '], spins: 0 };
      }

      // Calculate spins with randomness
      const baseSpins = settings.spins;
      const randomOffset = Math.floor(random() * settings.spinRandomness * baseSpins * 2) - (settings.spinRandomness * baseSpins);
      const actualSpins = Math.max(1, Math.round(baseSpins + randomOffset));

      // Build the stack
      const stack: string[] = [];
      for (let spin = 0; spin < actualSpins; spin++) {
        // Shuffle alphabet for each spin
        const shuffled = [...alphabetChars];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        stack.push(...shuffled);
      }
      // Add target at the end
      stack.push(char);

      return { target: char, stack, spins: actualSpins };
    });
  }, [chars, alphabet, global.seed, settings.spins, settings.spinRandomness]);

  // Calculate max stack length for timing
  const maxStackLength = useMemo(() => {
    return Math.max(...columns.map(c => c.stack.length));
  }, [columns]);

  // Easing
  const easing = useMemo(() => {
    return EASING_VALUES[global.easing];
  }, [global.easing]);

  // Handle column completion
  const handleColumnComplete = () => {
    completedRef.current++;
    if (completedRef.current === chars.length) {
      onComplete?.();
    }
  };

  // Character height in em
  const charHeight = 1.2;

  return (
    <span className="inline-flex">
      {columns.map((column, index) => {
        const stackLength = column.stack.length;
        const duration = (stackLength / maxStackLength) * (global.duration / 1000);
        const delay = (global.delay / 1000) + (index * global.stagger / 1000);

        // For spaces, just render a static space
        if (column.target === ' ') {
          return (
            <span
              key={`${key}-${index}`}
              className="inline-block"
              style={{ width: '0.3em' }}
            >
              &nbsp;
            </span>
          );
        }

        const finalY = settings.direction === 'up'
          ? -(stackLength - 1) * charHeight
          : 0;
        const initialY = settings.direction === 'up'
          ? 0
          : -(stackLength - 1) * charHeight;

        return (
          <span
            key={`${key}-${index}`}
            className="inline-block relative overflow-hidden"
            style={{ height: `${charHeight}em` }}
          >
            <motion.span
              className="inline-flex flex-col absolute left-0 top-0"
              initial={{ y: `${initialY}em` }}
              animate={{ y: `${finalY}em` }}
              transition={{
                duration,
                delay,
                ease: easing as [number, number, number, number],
              }}
              onAnimationComplete={handleColumnComplete}
            >
              {column.stack.map((char, charIndex) => (
                <span
                  key={charIndex}
                  className="flex items-center justify-center"
                  style={{ height: `${charHeight}em` }}
                >
                  {char}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
