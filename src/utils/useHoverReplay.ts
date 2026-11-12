import { useState } from 'react';
import type { PointerEvent } from 'react';

/** Counts mouse entries, so a card's numbers can count up again each time it is hovered. Touch taps do not count. */
export function useHoverReplay() {
  const [replayKey, setReplayKey] = useState(0);
  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') setReplayKey((count) => count + 1);
  };
  return { replayKey, hoverProps: { onPointerEnter } };
}
