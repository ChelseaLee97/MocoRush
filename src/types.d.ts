declare module '@react95/clippy' {
  export const Clippy: React.FC<{ agentName: string }>;
  export const ClippyProvider: React.FC<{ children: React.ReactNode }>;

  export const useClippy: () => { clippy: Agent };

  export type Agent = {
    play: (animationName: string) => void;
    animate: () => void;
    animations: () => string[];
    speak: (text: string) => void;
    moveTo: (x: number, y: number) => void;
    gestureAt: (x: number, y: number) => void;
    stopCurrent: () => void;
    stop: () => void;
  };
}
