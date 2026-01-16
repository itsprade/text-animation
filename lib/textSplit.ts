import { TextSplitResult } from '@/types';

/**
 * Punctuation characters to preserve in scramble
 */
export const PUNCTUATION = new Set(['.', ',', '!', '?', ';', ':', "'", '"', '-', '(', ')', '[', ']', '{', '}']);

/**
 * Split text into characters and words
 * - Characters: Array.from for grapheme safety
 * - Words: split keeping spaces as separate tokens
 */
export function splitText(text: string): TextSplitResult {
  // Characters: use Array.from for basic unicode safety
  const chars = Array.from(text);
  const charIndices = chars.map((_, i) => i);

  // Words: split keeping spaces as tokens
  const words: string[] = [];
  const wordIndices: number[] = [];
  let current = '';
  let wordIndex = 0;

  for (const char of chars) {
    if (char === ' ') {
      if (current) {
        words.push(current);
        wordIndices.push(wordIndex++);
      }
      words.push(' ');
      wordIndices.push(wordIndex++);
      current = '';
    } else {
      current += char;
    }
  }

  // Don't forget the last word
  if (current) {
    words.push(current);
    wordIndices.push(wordIndex);
  }

  return { chars, words, charIndices, wordIndices };
}

/**
 * Check if a character is punctuation
 */
export function isPunctuation(char: string): boolean {
  return PUNCTUATION.has(char);
}

/**
 * Check if a character should be preserved (space or punctuation when enabled)
 */
export function shouldPreserve(
  char: string,
  preserveSpaces: boolean,
  preservePunctuation: boolean
): boolean {
  if (preserveSpaces && char === ' ') return true;
  if (preservePunctuation && isPunctuation(char)) return true;
  return false;
}
