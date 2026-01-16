'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AppState } from '@/types';
import { generateExportCode } from '@/lib/exporter';
import { PRESET_META } from '@/lib/constants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: AppState;
}

export function ExportDialog({
  open,
  onOpenChange,
  state,
}: ExportDialogProps) {
  const [activeTab, setActiveTab] = useState('component');

  // Generate the export code
  const componentCode = useMemo(() => {
    return generateExportCode(state);
  }, [state]);

  // Generate CSS-only export (for simple animations)
  const cssCode = useMemo(() => {
    return generateCSSExport(state);
  }, [state]);

  // Copy to clipboard
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Download as file
  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  const presetName = PRESET_META.find(p => p.key === state.preset)?.name || state.preset;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Export Animation</DialogTitle>
          <DialogDescription>
            Export your &ldquo;{presetName}&rdquo; animation as a self-contained React component
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="shrink-0">
            <TabsTrigger value="component">React Component</TabsTrigger>
            <TabsTrigger value="css">CSS Only</TabsTrigger>
          </TabsList>

          <TabsContent value="component" className="flex-1 overflow-hidden flex flex-col mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">
                TitleMotion.tsx - Self-contained component with Framer Motion
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(componentCode, 'Component')}
                >
                  Copy
                </Button>
                <Button
                  size="sm"
                  onClick={() => downloadFile(componentCode, 'TitleMotion.tsx')}
                >
                  Download
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-muted rounded-lg p-4">
              <pre className="text-sm font-mono whitespace-pre overflow-x-auto">
                <code>{componentCode}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="css" className="flex-1 overflow-hidden flex flex-col mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">
                Basic CSS animation (limited presets)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(cssCode, 'CSS')}
                >
                  Copy
                </Button>
                <Button
                  size="sm"
                  onClick={() => downloadFile(cssCode, 'title-animation.css')}
                >
                  Download
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-muted rounded-lg p-4">
              <pre className="text-sm font-mono whitespace-pre overflow-x-auto">
                <code>{cssCode}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>

        <div className="border-t border-border pt-4 mt-4">
          <p className="text-sm text-muted-foreground">
            <strong>Dependency:</strong> The React component requires <code className="bg-muted px-1 rounded">framer-motion</code>
          </p>
          <pre className="mt-2 bg-muted p-2 rounded text-sm font-mono">
            npm install framer-motion
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Generate basic CSS export
function generateCSSExport(state: AppState): string {
  const { typography, global } = state;
  const duration = global.duration / 1000;
  const delay = global.delay / 1000;

  // Basic CSS animation based on preset
  let animationCSS = '';
  let keyframes = '';

  switch (state.preset) {
    case 'blur':
      keyframes = `@keyframes blurReveal {
  from {
    filter: blur(${state.blur.startBlur}px);
    opacity: ${state.blur.startOpacity};
    transform: translateY(${state.blur.yOffset}px);
  }
  to {
    filter: blur(0px);
    opacity: 1;
    transform: translateY(0);
  }
}`;
      animationCSS = `animation: blurReveal ${duration}s ease-out ${delay}s both;`;
      break;

    case 'maskWipe':
      const clipStart = state.maskWipe.direction === 'left' ? 'inset(0 100% 0 0)'
        : state.maskWipe.direction === 'right' ? 'inset(0 0 0 100%)'
        : state.maskWipe.direction === 'up' ? 'inset(100% 0 0 0)'
        : 'inset(0 0 100% 0)';
      keyframes = `@keyframes maskWipe {
  from {
    clip-path: ${clipStart};
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}`;
      animationCSS = `animation: maskWipe ${duration}s ease-out ${delay}s both;`;
      break;

    case 'wordSlideUp':
      keyframes = `@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(${state.wordSlideUp.yDistance}px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`;
      animationCSS = `animation: slideUp ${duration}s ease-out ${delay}s both;`;
      break;

    case 'charPop':
      keyframes = `@keyframes charPop {
  from {
    opacity: 0;
    transform: scale(${state.charPop.startScale});
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}`;
      animationCSS = `animation: charPop ${duration}s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s both;`;
      break;

    default:
      keyframes = `/* Note: The "${state.preset}" preset requires JavaScript for full functionality.
   This is a simplified fade-in animation. */

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}`;
      animationCSS = `animation: fadeIn ${duration}s ease-out ${delay}s both;`;
  }

  const fontFamily = typography.fontFamily === 'inter'
    ? 'Inter, system-ui, sans-serif'
    : typography.fontFamily === 'playfair'
    ? '"Playfair Display", Georgia, serif'
    : '"Space Mono", monospace';

  return `/**
 * Title Animation CSS
 * Generated by Title Motion Lab
 *
 * Note: Some presets (Scramble, Roller, Glitch) require JavaScript
 * for full functionality. This CSS provides a basic fallback.
 */

${keyframes}

.title-animation {
  font-family: ${fontFamily};
  font-size: ${typography.fontSize}px;
  font-weight: ${typography.fontWeight};
  letter-spacing: ${typography.letterSpacing}em;
  line-height: ${typography.lineHeight};
  text-transform: ${typography.textTransform};
  ${animationCSS}
}

/* For staggered animations, use animation-delay on children */
.title-animation span {
  display: inline-block;
}

/* Example: Add stagger delay to each character/word */
.title-animation span:nth-child(1) { animation-delay: ${delay}s; }
.title-animation span:nth-child(2) { animation-delay: ${delay + global.stagger / 1000}s; }
.title-animation span:nth-child(3) { animation-delay: ${delay + (global.stagger * 2) / 1000}s; }
/* ... continue for more elements */

/* Usage example:
<h1 class="title-animation">
  <span>S</span><span>e</span><span>c</span><span>o</span><span>n</span><span>d</span>
  <span> </span>
  <span>O</span><span>r</span><span>d</span><span>e</span><span>r</span>
</h1>
*/
`;
}
