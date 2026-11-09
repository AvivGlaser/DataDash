import type { TooltipPosition } from '../types';

const TOOLTIP_WIDTH = 280;
const TOOLTIP_ROOM_NEEDED = 170;
const EDGE_GAP = 12;
const ANCHOR_GAP = 8;

/** Places a tooltip under its anchor, or above it near the bottom of the screen, inside the page edges. */
export function getTooltipPosition(anchor: DOMRect): TooltipPosition {
  const pageWidth = document.documentElement.clientWidth;
  const widest = Math.min(TOOLTIP_WIDTH, pageWidth - EDGE_GAP * 2);
  const left = Math.max(EDGE_GAP, Math.min(anchor.right - widest, pageWidth - widest - EDGE_GAP));
  const fitsBelow = anchor.bottom + TOOLTIP_ROOM_NEEDED < window.innerHeight;

  return fitsBelow
    ? { left, top: anchor.bottom + window.scrollY + ANCHOR_GAP }
    : { left, top: anchor.top + window.scrollY - ANCHOR_GAP, transform: 'translateY(-100%)' };
}
