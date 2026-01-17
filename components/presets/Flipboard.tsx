'use client';

import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalSettings, TypographySettings, FlipboardSettings } from '@/types';
import { createPRNG } from '@/lib/prng';
import { ROLLER_ALPHABETS } from '@/lib/constants';

interface FlipboardProps {
  text: string;
  global: GlobalSettings;
  typography: TypographySettings;
  settings: FlipboardSettings;
  animationKey: number;
  onComplete?: () => void;
}

interface FlipData {
  target: string;
  sequence: string[];
  flipCount: number;
}

export function Flipboard({
  text,
  global,
  typography: _typography,
  settings,
  animationKey,
  onComplete,
}: FlipboardProps) {
  const chars = useMemo(() => Array.from(text), [text]);
  const completedRef = useRef(0);
  const [currentChars, setCurrentChars] = useState<string[]>([]);
  const [flippingIndices, setFlippingIndices] = useState<Set<number>>(new Set());
  const animationRef = useRef<NodeJS.Timeout[]>([]);

  // Get alphabet
  const alphabet = useMemo(() => {
    return ROLLER_ALPHABETS[settings.alphabet];
  }, [settings.alphabet]);

  // Generate flip data for each character
  const flipData = useMemo((): FlipData[] => {
    const random = createPRNG(global.seed);
    const alphabetChars = alphabet.split('');

    return chars.map((char) => {
      // Space - no animation
      if (char === ' ') {
        return { target: ' ', sequence: [' '], flipCount: 0 };
      }

      // Calculate flips with randomness
      const baseFlips = settings.flipsPerChar;
      const randomOffset = Math.floor(random() * settings.flipRandomness * baseFlips * 2) - (settings.flipRandomness * baseFlips);
      const actualFlips = Math.max(2, Math.round(baseFlips + randomOffset));

      // Build the sequence of characters to flip through
      const sequence: string[] = [];
      for (let i = 0; i < actualFlips - 1; i++) {
        const randomChar = alphabetChars[Math.floor(random() * alphabetChars.length)];
        sequence.push(randomChar);
      }
      // Final character is the target
      sequence.push(char.toUpperCase());

      return { target: char, sequence, flipCount: actualFlips };
    });
  }, [chars, alphabet, global.seed, settings.flipsPerChar, settings.flipRandomness]);

  // Start animation
  useEffect(() => {
    // Clear previous animations
    animationRef.current.forEach(clearTimeout);
    animationRef.current = [];
    completedRef.current = 0;

    // Initialize with empty or first character
    setCurrentChars(flipData.map(d => d.sequence[0] || ' '));
    setFlippingIndices(new Set());

    const flipDuration = (global.duration / 1000) / Math.max(...flipData.map(d => d.flipCount));
    const flipDurationMs = flipDuration * 1000;

    // Animate each character
    flipData.forEach((data, charIndex) => {
      if (data.target === ' ') {
        completedRef.current++;
        return;
      }

      const delay = global.delay + (charIndex * global.stagger);

      data.sequence.forEach((char, seqIndex) => {
        const timeout = setTimeout(() => {
          // Mark as flipping
          setFlippingIndices(prev => new Set(prev).add(charIndex));

          // Update character after brief flip
          setTimeout(() => {
            setCurrentChars(prev => {
              const next = [...prev];
              next[charIndex] = char;
              return next;
            });
            setFlippingIndices(prev => {
              const next = new Set(prev);
              next.delete(charIndex);
              return next;
            });

            // Check completion
            if (seqIndex === data.sequence.length - 1) {
              completedRef.current++;
              if (completedRef.current === chars.length) {
                onComplete?.();
              }
            }
          }, flipDurationMs * 0.4);
        }, delay + (seqIndex * flipDurationMs));

        animationRef.current.push(timeout);
      });
    });

    return () => {
      animationRef.current.forEach(clearTimeout);
    };
  }, [animationKey, flipData, global.delay, global.stagger, global.duration, chars.length, onComplete]);

  // Card dimensions based on font size - we don't use _typography fontSize here
  // as the parent container handles that
  const cardHeight = 1.4; // em
  const cardWidth = 0.9; // em
  const gap = 0.15; // em

  return (
    <span
      className="inline-flex flex-wrap items-center justify-center"
      style={{ gap: `${gap}em` }}
    >
      {chars.map((char, index) => {
        const isSpace = char === ' ';
        const currentChar = currentChars[index] || (isSpace ? ' ' : flipData[index]?.sequence[0] || '');
        const isFlipping = flippingIndices.has(index);

        if (isSpace) {
          return (
            <span
              key={`${animationKey}-${index}`}
              className="inline-block"
              style={{ width: `${cardWidth * 0.5}em` }}
            />
          );
        }

        return (
          <span
            key={`${animationKey}-${index}`}
            className="inline-block relative"
            style={{
              width: `${cardWidth}em`,
              height: `${cardHeight}em`,
              perspective: `${settings.perspective}px`,
            }}
          >
            {/* Card container */}
            <span
              className="absolute inset-0 rounded-sm overflow-hidden"
              style={{
                backgroundColor: settings.cardColor,
                boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              {/* Top half (static) */}
              <span
                className="absolute inset-x-0 top-0 overflow-hidden flex items-end justify-center"
                style={{
                  height: '50%',
                  backgroundColor: settings.cardColor,
                  borderBottom: settings.showDivider ? '1px solid rgba(0,0,0,0.3)' : 'none',
                }}
              >
                <span
                  className="absolute flex items-center justify-center"
                  style={{
                    color: settings.textColor,
                    height: `${cardHeight}em`,
                    width: '100%',
                    top: 0,
                  }}
                >
                  {currentChar}
                </span>
              </span>

              {/* Bottom half (static) */}
              <span
                className="absolute inset-x-0 bottom-0 overflow-hidden flex items-start justify-center"
                style={{
                  height: '50%',
                  backgroundColor: settings.cardColor,
                }}
              >
                <span
                  className="absolute flex items-center justify-center"
                  style={{
                    color: settings.textColor,
                    height: `${cardHeight}em`,
                    width: '100%',
                    bottom: 0,
                  }}
                >
                  {currentChar}
                </span>
              </span>

              {/* Flipping card (top half that flips down) */}
              <AnimatePresence>
                {isFlipping && (
                  <motion.span
                    className="absolute inset-x-0 top-0 overflow-hidden flex items-end justify-center origin-bottom"
                    style={{
                      height: '50%',
                      backgroundColor: settings.cardColor,
                      backfaceVisibility: 'hidden',
                      zIndex: 10,
                      borderBottom: settings.showDivider ? '1px solid rgba(0,0,0,0.3)' : 'none',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    }}
                    initial={{ rotateX: 0 }}
                    animate={{ rotateX: -90 }}
                    exit={{ rotateX: -90 }}
                    transition={{
                      duration: (global.duration / 1000) / Math.max(...flipData.map(d => d.flipCount)) * 0.4,
                      ease: 'easeIn',
                    }}
                  >
                    <span
                      className="absolute flex items-center justify-center"
                      style={{
                        color: settings.textColor,
                        height: `${cardHeight}em`,
                        width: '100%',
                        top: 0,
                      }}
                    >
                      {currentChars[index - 1] !== undefined ? currentChars[index] : flipData[index]?.sequence[0]}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </span>

            {/* Side notches for realism */}
            <span
              className="absolute rounded-full"
              style={{
                width: '3px',
                height: '6px',
                backgroundColor: '#333',
                left: '-2px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <span
              className="absolute rounded-full"
              style={{
                width: '3px',
                height: '6px',
                backgroundColor: '#333',
                right: '-2px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
          </span>
        );
      })}
    </span>
  );
}
