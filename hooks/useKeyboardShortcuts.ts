import { useEffect, useCallback } from 'react';

type ShortcutHandler = (e: KeyboardEvent) => void;

interface ShortcutMap {
  [key: string]: ShortcutHandler;
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap, enabled: boolean = true) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in input fields
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement || 
        event.target instanceof HTMLSelectElement) {
      return;
    }

    const key = [
      event.ctrlKey && 'Ctrl',
      event.metaKey && 'Cmd',
      event.altKey && 'Alt',
      event.shiftKey && 'Shift',
      event.key.toUpperCase()
    ].filter(Boolean).join('+');

    const handler = shortcuts[key];
    if (handler) {
      event.preventDefault();
      handler(event);
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Common shortcuts for file operations
export const FILE_SHORTCUTS = {
  'Ctrl+O': 'Open file picker',
  'Ctrl+Z': 'Undo',
  'Ctrl+Y': 'Redo',
  'Delete': 'Delete selected',
  'Escape': 'Cancel/Close',
  'Enter': 'Confirm/Submit',
  'Space': 'Toggle selection',
} as const;

// Shortcuts for navigation
export const NAVIGATION_SHORTCUTS = {
  'Ctrl+Home': 'Go to homepage',
  'Ctrl+1': 'Go to first tool',
  'Ctrl+2': 'Go to second tool',
  'Ctrl+/': 'Focus search',
  'Ctrl+K': 'Focus search',
} as const;