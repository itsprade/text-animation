/**
 * Mulberry32 - A fast, high-quality 32-bit PRNG
 * Deterministic given the same seed
 */
export function createPRNG(seed: number): () => number {
  let state = seed;

  return function random(): number {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Utilities built on the seeded PRNG
 */
export function createRandomUtils(seed: number) {
  const random = createPRNG(seed);

  return {
    random,

    /** Random float in range [min, max) */
    float: (min: number, max: number): number => {
      return random() * (max - min) + min;
    },

    /** Random integer in range [min, max] inclusive */
    int: (min: number, max: number): number => {
      return Math.floor(random() * (max - min + 1)) + min;
    },

    /** Random element from array */
    pick: <T>(arr: T[]): T => {
      return arr[Math.floor(random() * arr.length)];
    },

    /** Shuffle array in place (Fisher-Yates) */
    shuffle: <T>(arr: T[]): T[] => {
      const result = [...arr];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    },

    /** Generate reveal order based on mode */
    generateRevealOrder: (
      length: number,
      mode: 'ltr' | 'rtl' | 'center' | 'random'
    ): number[] => {
      const indices = Array.from({ length }, (_, i) => i);

      switch (mode) {
        case 'ltr':
          return indices;
        case 'rtl':
          return indices.reverse();
        case 'center': {
          const center = Math.floor(length / 2);
          const result: number[] = [center];
          for (let offset = 1; result.length < length; offset++) {
            if (center - offset >= 0) result.push(center - offset);
            if (center + offset < length) result.push(center + offset);
          }
          return result;
        }
        case 'random': {
          // Use a new PRNG instance for determinism
          const shuffleRandom = createPRNG(seed + 12345);
          for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(shuffleRandom() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
          }
          return indices;
        }
        default:
          return indices;
      }
    },
  };
}

/**
 * Inlined PRNG code for export (as string)
 */
export const PRNG_CODE = `function createPRNG(seed) {
  let state = seed;
  return function random() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}`;
