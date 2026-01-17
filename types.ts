// Preset keys
export type PresetKey =
  | 'scramble'
  | 'blur'
  | 'roller'
  | 'flipboard'
  | 'wordSlideUp'
  | 'charPop'
  | 'maskWipe'
  | 'underlineWipe'
  | 'glitchSlice'
  | 'particleBurst'
  | 'sparkleTrail';

// Easing types
export type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'anticipate';

// Reveal modes for scramble
export type RevealMode = 'ltr' | 'rtl' | 'center' | 'random';

// Animation state
export type AnimationState = 'idle' | 'playing' | 'paused' | 'complete';

// Font family options
export type FontFamily = 'inter' | 'playfair' | 'spaceMono';

// Background type options
export type BackgroundType = 'transparent' | 'light' | 'dark' | 'custom';

// Direction options
export type Direction = 'up' | 'down' | 'left' | 'right';

// Animation unit
export type AnimationUnit = 'char' | 'word' | 'line';

// Character set modes for scramble
export type CharsetMode = 'special' | 'alphanumeric';

// Global settings
export interface GlobalSettings {
  duration: number;    // ms
  stagger: number;     // ms
  delay: number;       // ms
  easing: EasingType;
  seed: number;
  loop: boolean;
}

// Typography settings
export interface TypographySettings {
  fontFamily: FontFamily;
  fontSize: number;       // px
  fontWeight: number;
  letterSpacing: number;  // em
  lineHeight: number;
  textTransform: 'none' | 'uppercase';
}

// Background setting
export interface BackgroundSetting {
  type: BackgroundType;
  customColor: string;
}

// Scramble preset settings
export interface ScrambleSettings {
  charsetMode: CharsetMode;
  intensity: number;      // 0-1
  steps: number;          // 1-50
  revealMode: RevealMode;
  preserveSpaces: boolean;
  preservePunctuation: boolean;
}

// Blur reveal preset settings
export interface BlurSettings {
  startBlur: number;      // px
  startOpacity: number;   // 0-1
  yOffset: number;        // px
  overshoot: boolean;
  unit: AnimationUnit;
}

// Roller board preset settings
export interface RollerSettings {
  alphabet: 'uppercase' | 'lowercase' | 'numbers' | 'full';
  spins: number;          // 1-10
  spinRandomness: number; // 0-1
  direction: 'up' | 'down';
}

// Flipboard preset settings
export interface FlipboardSettings {
  alphabet: 'uppercase' | 'lowercase' | 'numbers' | 'full';
  flipsPerChar: number;       // 3-15
  flipRandomness: number;     // 0-1
  cardColor: string;          // card background
  textColor: string;          // text on cards
  showDivider: boolean;       // horizontal divider line
  perspective: number;        // 3D perspective depth
}

// Word slide up preset settings
export interface WordSlideUpSettings {
  yDistance: number;      // px
  overshoot: boolean;
}

// Char pop preset settings
export interface CharPopSettings {
  startScale: number;     // 0.5-0.95
  springStiffness: number; // 100-500
}

// Mask wipe preset settings
export interface MaskWipeSettings {
  direction: Direction;
  unit: 'word' | 'line';
}

// Underline wipe preset settings
export interface UnderlineWipeSettings {
  underlineColor: string;
  thickness: number;      // px
  phaseOverlap: number;   // 0-100 (%)
}

// Glitch slice preset settings
export interface GlitchSliceSettings {
  intensity: number;      // 0-1
  offsetAmount: number;   // px
  colorSeparation: boolean;
}

// Particle burst preset settings
export interface ParticleBurstSettings {
  particleCount: number;    // 10-50
  particleSize: number;     // 2-8 px
  burstRadius: number;      // 20-100 px
  particleColor: string;
  fadeParticles: boolean;
  burstDirection: 'outward' | 'inward';
}

// Sparkle trail preset settings
export interface SparkleTrailSettings {
  sparkleCount: number;     // 5-30
  sparkleSize: number;      // 2-6 px
  trailLength: number;      // 1-5
  sparkleColor: string;
  randomColors: boolean;
  twinkle: boolean;
}

// Union type for all preset settings
export type PresetSettings =
  | ScrambleSettings
  | BlurSettings
  | RollerSettings
  | FlipboardSettings
  | WordSlideUpSettings
  | CharPopSettings
  | MaskWipeSettings
  | UnderlineWipeSettings
  | GlitchSliceSettings
  | ParticleBurstSettings
  | SparkleTrailSettings;

// Complete app state
export interface AppState {
  text: string;
  preset: PresetKey;
  global: GlobalSettings;
  typography: TypographySettings;
  background: BackgroundSetting;
  // Preset-specific settings
  scramble: ScrambleSettings;
  blur: BlurSettings;
  roller: RollerSettings;
  flipboard: FlipboardSettings;
  wordSlideUp: WordSlideUpSettings;
  charPop: CharPopSettings;
  maskWipe: MaskWipeSettings;
  underlineWipe: UnderlineWipeSettings;
  glitchSlice: GlitchSliceSettings;
  particleBurst: ParticleBurstSettings;
  sparkleTrail: SparkleTrailSettings;
}

// Animation controls interface
export interface AnimationControls {
  state: AnimationState;
  play: () => void;
  pause: () => void;
  replay: () => void;
  reset: () => void;
}

// Preset component props
export interface PresetProps {
  text: string;
  global: GlobalSettings;
  typography: TypographySettings;
  settings: PresetSettings;
  animationKey: number;
  onComplete?: () => void;
}

// Preset metadata
export interface PresetMeta {
  key: PresetKey;
  name: string;
  description: string;
}

// Text split result
export interface TextSplitResult {
  chars: string[];
  words: string[];
  charIndices: number[];
  wordIndices: number[];
}

// Character state for scramble animation
export interface CharacterState {
  target: string;
  current: string;
  isRevealed: boolean;
  revealOrder: number;
}

// Roller column state
export interface RollerColumnState {
  target: string;
  stack: string[];
  spins: number;
}
