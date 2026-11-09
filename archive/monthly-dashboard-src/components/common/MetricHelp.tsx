import { useId, useState } from 'react';
import type { FocusEvent, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import type { MetricHelpProps, TooltipPosition } from '../../types';
import { getTooltipPosition } from '../../utils/tooltipPosition';

export function MetricHelp({ calculation }: MetricHelpProps) {
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const tooltipId = useId();
  const showTooltip = (event: MouseEvent<HTMLButtonElement> | FocusEvent<HTMLButtonElement>) =>
    setPosition(getTooltipPosition(event.currentTarget.getBoundingClientRect()));
  const hideTooltip = () => setPosition(null);

  return (
    <>
      <button
        type="button"
        className="metric-help"
        aria-label={`How ${calculation.term} is calculated`}
        aria-describedby={position ? tooltipId : undefined}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
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
