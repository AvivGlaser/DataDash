import { useEffect } from 'react';
import type { RefObject } from 'react';

/** While open, calls onDismiss when the user presses outside the anchor or rotates the device. */
export function useDismissOnOutsidePress(isOpen: boolean, anchorRef: RefObject<HTMLElement | null>, onDismiss: () => void) {
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!anchorRef.current?.contains(event.target as Node)) onDismiss();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('orientationchange', onDismiss);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('orientationchange', onDismiss);
    };
  }, [isOpen, anchorRef, onDismiss]);
}
