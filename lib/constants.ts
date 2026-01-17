import type {
  AppState,
  GlobalSettings,
  TypographySettings,
  BackgroundSetting,
  ScrambleSettings,
  BlurSettings,
  RollerSettings,
  FlipboardSettings,
  WordSlideUpSettings,
  CharPopSettings,
  MaskWipeSettings,
  UnderlineWipeSettings,
  GlitchSliceSettings,
  ParticleBurstSettings,
  SparkleTrailSettings,
  PresetMeta,
  EasingType,
} from '@/types';

// Character sets
export const SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
export const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export const ALPHANUMERIC_SPECIAL = ALPHANUMERIC + SPECIAL_CHARS;

// Roller alphabets
export const ROLLER_ALPHABETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  full: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
};

// Easing options for select
export const EASING_OPTIONS: { value: EasingType; label: string }[] = [
  { value: 'linear', label: 'Linear' },
  { value: 'easeIn', label: 'Ease In' },
  { value: 'easeOut', label: 'Ease Out' },
  { value: 'easeInOut', label: 'Ease In Out' },
  { value: 'anticipate', label: 'Anticipate' },
];

// Easing values for Framer Motion (cubic bezier arrays)
export const EASING_VALUES: Record<EasingType, [number, number, number, number]> = {
  linear: [0, 0, 1, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  anticipate: [0.36, 0, 0.66, -0.56],
};

// Font family options
export const FONT_OPTIONS = [
  { value: 'inter', label: 'Inter', variable: 'var(--font-inter)' },
  { value: 'playfair', label: 'Playfair Display', variable: 'var(--font-playfair)' },
  { value: 'spaceMono', label: 'Space Mono', variable: 'var(--font-space-mono)' },
];

// Preset metadata
export const PRESET_META: PresetMeta[] = [
  { key: 'scramble', name: 'Scramble', description: 'Text shuffles into place' },
  { key: 'blur', name: 'Blur Reveal', description: 'Appears from blur' },
  { key: 'roller', name: 'Roller Board', description: 'Airport board style' },
  { key: 'flipboard', name: 'Flipboard', description: 'Split-flap display' },
  { key: 'wordSlideUp', name: 'Word Slide Up', description: 'Words slide from below' },
  { key: 'charPop', name: 'Char Pop', description: 'Characters pop in' },
  { key: 'maskWipe', name: 'Mask Wipe', description: 'Clip-path reveal' },
  { key: 'underlineWipe', name: 'Underline Wipe', description: 'Underline then text' },
  { key: 'glitchSlice', name: 'Glitch Slice', description: 'RGB glitch effect' },
  { key: 'particleBurst', name: 'Particle Burst', description: 'Exploding particles' },
  { key: 'sparkleTrail', name: 'Sparkle Trail', description: 'Twinkling sparkles' },
];

// Default global settings
export const DEFAULT_GLOBAL: GlobalSettings = {
  duration: 900,
  stagger: 25,
  delay: 0,
  easing: 'easeOut',
  seed: 42,
  loop: false,
};

// Default typography settings
export const DEFAULT_TYPOGRAPHY: TypographySettings = {
  fontFamily: 'inter',
  fontSize: 56,
  fontWeight: 700,
  letterSpacing: -0.02,
  lineHeight: 1.1,
  textTransform: 'none',
};

// Default background setting
export const DEFAULT_BACKGROUND: BackgroundSetting = {
  type: 'dark',
  customColor: '#ffffff',
};

// Default scramble settings
export const DEFAULT_SCRAMBLE: ScrambleSettings = {
  charsetMode: 'special',
  intensity: 0.6,
  steps: 24,
  revealMode: 'ltr',
  preserveSpaces: true,
  preservePunctuation: true,
};

// Default blur settings
export const DEFAULT_BLUR: BlurSettings = {
  startBlur: 12,
  startOpacity: 0,
  yOffset: 6,
  overshoot: false,
  unit: 'char',
};

// Default roller settings
export const DEFAULT_ROLLER: RollerSettings = {
  alphabet: 'full',
  spins: 5,
  spinRandomness: 0.25,
  direction: 'up',
};

// Default flipboard settings
export const DEFAULT_FLIPBOARD: FlipboardSettings = {
  alphabet: 'uppercase',
  flipsPerChar: 8,
  flipRandomness: 0.3,
  cardColor: '#1a1a1a',
  textColor: '#ffffff',
  showDivider: true,
  perspective: 400,
};

// Default word slide up settings
export const DEFAULT_WORD_SLIDE_UP: WordSlideUpSettings = {
  yDistance: 30,
  overshoot: true,
};

// Default char pop settings
export const DEFAULT_CHAR_POP: CharPopSettings = {
  startScale: 0.8,
  springStiffness: 300,
};

// Default mask wipe settings
export const DEFAULT_MASK_WIPE: MaskWipeSettings = {
  direction: 'left',
  unit: 'line',
};

// Default underline wipe settings
export const DEFAULT_UNDERLINE_WIPE: UnderlineWipeSettings = {
  underlineColor: '#000000',
  thickness: 2,
  phaseOverlap: 20,
};

// Default glitch slice settings
export const DEFAULT_GLITCH_SLICE: GlitchSliceSettings = {
  intensity: 0.7,
  offsetAmount: 4,
  colorSeparation: true,
};

// Default particle burst settings
export const DEFAULT_PARTICLE_BURST: ParticleBurstSettings = {
  particleCount: 20,
  particleSize: 4,
  burstRadius: 50,
  particleColor: '#fbbf24',
  fadeParticles: true,
  burstDirection: 'outward',
};

// Default sparkle trail settings
export const DEFAULT_SPARKLE_TRAIL: SparkleTrailSettings = {
  sparkleCount: 15,
  sparkleSize: 4,
  trailLength: 3,
  sparkleColor: '#fbbf24',
  randomColors: true,
  twinkle: true,
};

// Default text
export const DEFAULT_TEXT = 'Second Order Thinking';

// Complete default state
export const DEFAULT_STATE: AppState = {
  text: DEFAULT_TEXT,
  preset: 'scramble',
  global: DEFAULT_GLOBAL,
  typography: DEFAULT_TYPOGRAPHY,
  background: DEFAULT_BACKGROUND,
  scramble: DEFAULT_SCRAMBLE,
  blur: DEFAULT_BLUR,
  roller: DEFAULT_ROLLER,
  flipboard: DEFAULT_FLIPBOARD,
  wordSlideUp: DEFAULT_WORD_SLIDE_UP,
  charPop: DEFAULT_CHAR_POP,
  maskWipe: DEFAULT_MASK_WIPE,
  underlineWipe: DEFAULT_UNDERLINE_WIPE,
  glitchSlice: DEFAULT_GLITCH_SLICE,
  particleBurst: DEFAULT_PARTICLE_BURST,
  sparkleTrail: DEFAULT_SPARKLE_TRAIL,
};

// Max text length
export const MAX_TEXT_LENGTH = 120;
