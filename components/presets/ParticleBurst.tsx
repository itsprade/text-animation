'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalSettings, TypographySettings, ParticleBurstSettings } from '@/types';
import { createPRNG } from '@/lib/prng';
import { EASING_VALUES } from '@/lib/constants';

interface ParticleBurstProps {
  text: string;
  global: GlobalSettings;
  typography: TypographySettings;
  settings: ParticleBurstSettings;
  animationKey: number;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
}

export function ParticleBurst({
  text,
  global,
  typography: _typography,
  settings,
  animationKey,
  onComplete,
}: ParticleBurstProps) {
  const chars = useMemo(() => Array.from(text), [text]);
  const [visibleChars, setVisibleChars] = useState<boolean[]>([]);
  const [particles, setParticles] = useState<Particle[][]>([]);
  const completedRef = useRef(0);
  const [key, setKey] = useState(animationKey);

  // Reset on animation key change
  useEffect(() => {
    completedRef.current = 0;
    setKey(animationKey);
    setVisibleChars(new Array(chars.length).fill(false));

    // Generate particles for each character
    const random = createPRNG(global.seed);
    const allParticles: Particle[][] = chars.map((char, charIndex) => {
      if (char === ' ') return [];

      const charParticles: Particle[] = [];
      for (let i = 0; i < settings.particleCount; i++) {
        const angle = random() * Math.PI * 2;
        const distance = settings.burstRadius * (0.3 + random() * 0.7);
        charParticles.push({
          id: i,
          x: 0,
          y: 0,
          angle,
          distance,
          size: settings.particleSize * (0.5 + random() * 0.5),
          delay: random() * 0.2,
        });
      }
      return charParticles;
    });
    setParticles(allParticles);

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
  }, [animationKey, chars, global.seed, global.delay, global.stagger, settings.particleCount, settings.burstRadius, settings.particleSize]);

  const easing = useMemo(() => EASING_VALUES[global.easing], [global.easing]);
  const duration = global.duration / 1000;

  // Handle character animation complete
  const handleCharComplete = (index: number) => {
    completedRef.current++;
    if (completedRef.current === chars.filter(c => c !== ' ').length) {
      setTimeout(() => onComplete?.(), 100);
    }
  };

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

        const charParticles = particles[index] || [];
        const isVisible = visibleChars[index];
        const isInward = settings.burstDirection === 'inward';

        return (
          <span
            key={`${key}-${index}`}
            className="inline-block relative"
          >
            {/* Particles */}
            <AnimatePresence>
              {isVisible && charParticles.map((particle) => {
                const startX = isInward ? Math.cos(particle.angle) * particle.distance : 0;
                const startY = isInward ? Math.sin(particle.angle) * particle.distance : 0;
                const endX = isInward ? 0 : Math.cos(particle.angle) * particle.distance;
                const endY = isInward ? 0 : Math.sin(particle.angle) * particle.distance;

                return (
                  <motion.span
                    key={`particle-${particle.id}`}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: particle.size,
                      height: particle.size,
                      backgroundColor: settings.particleColor,
                      left: '50%',
                      top: '50%',
                      marginLeft: -particle.size / 2,
                      marginTop: -particle.size / 2,
                    }}
                    initial={{
                      x: startX,
                      y: startY,
                      opacity: isInward ? 1 : 0,
                      scale: isInward ? 1 : 0.5,
                    }}
                    animate={{
                      x: endX,
                      y: endY,
                      opacity: settings.fadeParticles ? (isInward ? 0 : [0, 1, 1, 0]) : 1,
                      scale: isInward ? 0.5 : 1,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: duration * 0.6,
                      delay: particle.delay,
                      ease: easing as [number, number, number, number],
                    }}
                  />
                );
              })}
            </AnimatePresence>

            {/* Character */}
            <motion.span
              className="inline-block relative z-10"
              initial={{
                opacity: 0,
                scale: isInward ? 0.8 : 1.2,
              }}
              animate={isVisible ? {
                opacity: 1,
                scale: 1,
              } : {
                opacity: 0,
                scale: isInward ? 0.8 : 1.2,
              }}
              transition={{
                duration: duration * 0.5,
                delay: isInward ? duration * 0.3 : 0,
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
