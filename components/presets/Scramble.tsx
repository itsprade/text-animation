'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GlobalSettings, TypographySettings, ScrambleSettings, CharacterState } from '@/types';
import { createPRNG, createRandomUtils } from '@/lib/prng';
import { SPECIAL_CHARS, ALPHANUMERIC_SPECIAL } from '@/lib/constants';
import { shouldPreserve } from '@/lib/textSplit';

interface ScrambleProps {
  text: string;
  global: GlobalSettings;
  typography: TypographySettings;
  settings: ScrambleSettings;
  animationKey: number;
  onComplete?: () => void;
}

export function Scramble({
  text,
  global,
  typography: _typography,
  settings,
  animationKey,
  onComplete,
}: ScrambleProps) {
  // Get the character set based on mode
  const charset = useMemo(() => {
    return settings.charsetMode === 'special' ? SPECIAL_CHARS : ALPHANUMERIC_SPECIAL;
  }, [settings.charsetMode]);

  // Create random utilities
  const randomUtils = useMemo(() => {
    return createRandomUtils(global.seed);
  }, [global.seed]);

  // Split text into characters
  const chars = useMemo(() => Array.from(text), [text]);

  // Generate reveal order based on mode
  const revealOrder = useMemo(() => {
    return randomUtils.generateRevealOrder(chars.length, settings.revealMode);
  }, [chars.length, settings.revealMode, randomUtils]);

  // Initialize character states
  const getInitialStates = useCallback((): CharacterState[] => {
    const initRandom = createPRNG(global.seed);
    const charsetArr = charset.split('');

    return chars.map((char, index) => {
      const preserve = shouldPreserve(char, settings.preserveSpaces, settings.preservePunctuation);
      return {
        target: char,
        current: preserve ? char : charsetArr[Math.floor(initRandom() * charsetArr.length)],
        isRevealed: preserve,
        revealOrder: revealOrder.indexOf(index),
      };
    });
  }, [chars, charset, global.seed, settings.preserveSpaces, settings.preservePunctuation, revealOrder]);

  const [charStates, setCharStates] = useState<CharacterState[]>(getInitialStates);
  const tickRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate timing
  const tickInterval = useMemo(() => {
    // Total duration divided by steps
    return global.duration / settings.steps;
  }, [global.duration, settings.steps]);

  // Reset when animation key changes
  useEffect(() => {
    tickRef.current = 0;
    setCharStates(getInitialStates());

    // Start animation after delay
    const delayTimeout = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        tickRef.current++;
        const currentTick = tickRef.current;
        const totalTicks = settings.steps;

        setCharStates(prevStates => {
          // Create PRNG for this tick
          const tickRandom = createPRNG(global.seed + currentTick * 1000);
          const charsetArr = charset.split('');

          const newStates = prevStates.map((state, index) => {
            // Already revealed or preserved
            if (state.isRevealed) return state;

            // Calculate when this character should reveal
            // revealOrder is the position in the reveal sequence (0 = first)
            // We spread reveals across the total ticks based on intensity
            const revealThreshold = (state.revealOrder / chars.length) * totalTicks * settings.intensity;
            const shouldReveal = currentTick >= revealThreshold + (totalTicks * (1 - settings.intensity));

            if (shouldReveal) {
              return {
                ...state,
                current: state.target,
                isRevealed: true,
              };
            }

            // Still scrambling - pick random character
            return {
              ...state,
              current: charsetArr[Math.floor(tickRandom() * charsetArr.length)],
            };
          });

          // Check if all revealed
          const allRevealed = newStates.every(s => s.isRevealed);
          if (allRevealed && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setTimeout(() => onComplete?.(), 50);
          }

          return newStates;
        });
      }, tickInterval);
    }, global.delay);

    return () => {
      clearTimeout(delayTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [animationKey, getInitialStates, global.delay, global.seed, tickInterval, settings.steps, settings.intensity, charset, chars.length, onComplete]);

  return (
    <span className="inline-flex flex-wrap">
      {charStates.map((state, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: state.isRevealed ? 1 : 0.7 }}
          transition={{ duration: 0.1 }}
          className="inline-block whitespace-pre"
          style={{
            minWidth: state.target === ' ' ? '0.25em' : undefined,
          }}
        >
          {state.current}
        </motion.span>
      ))}
    </span>
  );
}
