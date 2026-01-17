'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { AppState, AnimationState, PresetKey } from '@/types';
import { DEFAULT_STATE } from '@/lib/constants';
import { PreviewStage } from '@/components/PreviewStage';
import { ControlsPanel } from '@/components/ControlsPanel';
import { ExportDialog } from '@/components/ExportDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';

export default function Home() {
  // App state
  const [state, setState] = useState<AppState>(DEFAULT_STATE);

  // Animation controls
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [animationKey, setAnimationKey] = useState(0);

  // Export dialog
  const [exportOpen, setExportOpen] = useState(false);

  // State updaters
  const updateState = useCallback(<K extends keyof AppState>(
    key: K,
    value: AppState[K]
  ) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateGlobal = useCallback(<K extends keyof AppState['global']>(
    key: K,
    value: AppState['global'][K]
  ) => {
    setState(prev => ({
      ...prev,
      global: { ...prev.global, [key]: value }
    }));
  }, []);

  const updateTypography = useCallback(<K extends keyof AppState['typography']>(
    key: K,
    value: AppState['typography'][K]
  ) => {
    setState(prev => ({
      ...prev,
      typography: { ...prev.typography, [key]: value }
    }));
  }, []);

  const updateBackground = useCallback(<K extends keyof AppState['background']>(
    key: K,
    value: AppState['background'][K]
  ) => {
    setState(prev => ({
      ...prev,
      background: { ...prev.background, [key]: value }
    }));
  }, []);

  const updatePresetSettings = useCallback(<K extends PresetKey>(
    preset: K,
    settings: Partial<AppState[K]>
  ) => {
    setState(prev => ({
      ...prev,
      [preset]: { ...prev[preset], ...settings }
    }));
  }, []);

  // Animation controls
  const play = useCallback(() => {
    setAnimationState('playing');
    setAnimationKey(prev => prev + 1);
  }, []);

  const replay = useCallback(() => {
    setAnimationState('idle');
    setTimeout(() => {
      setAnimationState('playing');
      setAnimationKey(prev => prev + 1);
    }, 50);
  }, []);

  const pause = useCallback(() => {
    setAnimationState('paused');
  }, []);

  const resume = useCallback(() => {
    setAnimationState('playing');
  }, []);

  const onAnimationComplete = useCallback(() => {
    if (state.global.loop) {
      replay();
    } else {
      setAnimationState('complete');
    }
  }, [state.global.loop, replay]);

  // Reset to defaults
  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
    setAnimationKey(prev => prev + 1);
    toast.success('Reset to defaults');
  }, []);

  // Randomize seed
  const randomizeSeed = useCallback(() => {
    const newSeed = Math.floor(Math.random() * 100000);
    updateGlobal('seed', newSeed);
    setAnimationKey(prev => prev + 1);
    toast.success(`New seed: ${newSeed}`);
  }, [updateGlobal]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight">Title Motion Lab</h1>
          <span className="text-sm text-muted-foreground">
            Built by{' '}
            <a
              href="https://www.itsprade.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              itsprade
            </a>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            Reset
          </Button>
          <Button size="sm" onClick={() => setExportOpen(true)}>
            Export
          </Button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Controls */}
        <div className="w-[380px] border-r border-border overflow-y-auto shrink-0">
          <ControlsPanel
            state={state}
            animationState={animationState}
            updateState={updateState}
            updateGlobal={updateGlobal}
            updateTypography={updateTypography}
            updateBackground={updateBackground}
            updatePresetSettings={updatePresetSettings}
            play={play}
            replay={replay}
            pause={pause}
            resume={resume}
            randomizeSeed={randomizeSeed}
          />
        </div>

        {/* Right panel - Preview */}
        <div className="flex-1 overflow-hidden">
          <PreviewStage
            state={state}
            animationKey={animationKey}
            onComplete={onAnimationComplete}
          />
        </div>
      </div>

      {/* Export dialog */}
      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        state={state}
      />
    </div>
  );
}
