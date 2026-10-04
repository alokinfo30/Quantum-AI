import { useEffect } from 'react';

export interface ShortcutHandlers {
  onToggleVoice?: () => void;
  onClearChat?: () => void;
  onOpenCanvas?: () => void;
  onOpenVoiceModal?: () => void;
}

/**
 * Custom hook to register global keyboard shortcuts.
 * Supports both Ctrl (Windows/Linux) and Meta/Cmd (macOS).
 * - Ctrl+M / Cmd+M: Toggle voice recording (Web Speech API)
 * - Ctrl+K / Cmd+K: Clear chat / new session
 */
export function useKeyboardShortcuts({
  onToggleVoice,
  onClearChat,
  onOpenCanvas,
  onOpenVoiceModal,
}: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isModifier = event.ctrlKey || event.metaKey;

      if (!isModifier) return;

      const key = event.key.toLowerCase();

      // Ctrl+M or Cmd+M -> Toggle Voice Recording
      if (key === 'm') {
        event.preventDefault();
        onToggleVoice?.();
      }

      // Ctrl+K or Cmd+K -> Clear Chat / Reset Session
      if (key === 'k') {
        event.preventDefault();
        onClearChat?.();
      }

      // Ctrl+B or Cmd+B -> Toggle Quantum Canvas
      if (key === 'b') {
        event.preventDefault();
        onOpenCanvas?.();
      }

      // Ctrl+H or Cmd+H -> Toggle Holographic Voice HUD
      if (key === 'h') {
        event.preventDefault();
        onOpenVoiceModal?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onToggleVoice, onClearChat, onOpenCanvas, onOpenVoiceModal]);
}
