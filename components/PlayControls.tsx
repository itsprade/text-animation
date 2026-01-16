'use client';

import { AnimationState } from '@/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface PlayControlsProps {
  animationState: AnimationState;
  loop: boolean;
  onLoopChange: (loop: boolean) => void;
  play: () => void;
  replay: () => void;
  pause: () => void;
  resume: () => void;
}

export function PlayControls({
  animationState,
  loop,
  onLoopChange,
  play,
  replay,
  pause,
  resume,
}: PlayControlsProps) {
  const isPlaying = animationState === 'playing';
  const isPaused = animationState === 'paused';
  const isIdle = animationState === 'idle';

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Playback</Label>

      <div className="flex items-center gap-2">
        {/* Play / Pause / Resume */}
        {isIdle && (
          <Button size="sm" onClick={play} className="flex-1">
            <PlayIcon className="w-4 h-4 mr-1" />
            Play
          </Button>
        )}

        {isPlaying && (
          <Button size="sm" variant="outline" onClick={pause} className="flex-1">
            <PauseIcon className="w-4 h-4 mr-1" />
            Pause
          </Button>
        )}

        {isPaused && (
          <Button size="sm" onClick={resume} className="flex-1">
            <PlayIcon className="w-4 h-4 mr-1" />
            Resume
          </Button>
        )}

        {/* Replay */}
        <Button size="sm" variant="outline" onClick={replay}>
          <ReplayIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Loop toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="loop-toggle" className="text-sm">Loop animation</Label>
        <Switch
          id="loop-toggle"
          checked={loop}
          onCheckedChange={onLoopChange}
        />
      </div>
    </div>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function ReplayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
    </svg>
  );
}
