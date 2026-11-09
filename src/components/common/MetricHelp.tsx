import { useCallback, useId, useRef, useState } from 'react';
import type { FocusEvent, PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import type { MetricHelpProps, TooltipPosition } from '../../types';
import { getTooltipPosition } from '../../utils/tooltipPosition';
import { useDismissOnOutsidePress } from '../../utils/useDismissOnOutsidePress';

export function MetricHelp({ calculation }: MetricHelpProps) {
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const tooltipId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastPointerType = useRef('');
  const hideTooltip = useCallback(() => setPosition(null), []);
  const showTooltip = (button: HTMLButtonElement) => setPosition(getTooltipPosition(button.getBoundingClientRect()));

  useDismissOnOutsidePress(position !== null, buttonRef, hideTooltip);

  const handlePointerEnter = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse') showTooltip(event.currentTarget);
  };
  const handlePointerLeave = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse') hideTooltip();
  };
  const handleFocus = (event: FocusEvent<HTMLButtonElement>) => {
    if (event.currentTarget.matches(':focus-visible')) showTooltip(event.currentTarget);
  };
  const handleTap = () => {
    if (lastPointerType.current === 'mouse' || !buttonRef.current) return;
    if (position) hideTooltip();
    else showTooltip(buttonRef.current);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="metric-help"
        aria-label={`How ${calculation.term} is calculated`}
        aria-describedby={position ? tooltipId : undefined}
        onPointerDown={(event) => { lastPointerType.current = event.pointerType; }}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocus={handleFocus}
        onBlur={hideTooltip}
        onClick={handleTap}
        onKeyDown={(event) => { if (event.key === 'Escape') hideTooltip(); }}
      >
        ?
      </button>
      {position && createPortal(
        <div id={tooltipId} role="tooltip" className="metric-tooltip" style={position}>
          <strong>How {calculation.term} is calculated</strong>
          <p>{calculation.formula}</p>
          {calculation.worked && <p className="metric-tooltip-worked">{calculation.worked}</p>}
        </div>,
        document.body,
      )}
    </>
  );
}
