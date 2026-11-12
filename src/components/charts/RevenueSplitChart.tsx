import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { RevenueSplitChartProps } from '../../types';
import { formatPercent } from '../../utils/format';

/** Segments narrower than this have no room for their percentage inside the bar */
const MIN_SHARE_FOR_INSIDE_LABEL = 14;

export function RevenueSplitChart({ split }: RevenueSplitChartProps) {
  // The bar grows in from empty once it is on screen
  const [isDrawn, setIsDrawn] = useState(false);
  useEffect(() => { const frame = requestAnimationFrame(() => setIsDrawn(true)); return () => cancelAnimationFrame(frame); }, []);

  return (
    <div className="split-chart" role="img" aria-label={split.ariaLabel}>
      <p className="split-headline">
        {split.headline.before} <strong>{split.headline.amount}</strong> {split.headline.after}
      </p>

      <div className="split-bar" aria-hidden="true">
        {split.segments.map((segment) => (
          <div
            key={segment.id}
            className={`split-segment split-${segment.id}`}
            style={{ width: isDrawn ? `${segment.share}%` : '0%', '--segment': segment.color } as CSSProperties}
          >
            {segment.share >= MIN_SHARE_FOR_INSIDE_LABEL && <span>{formatPercent(segment.share)}</span>}
          </div>
        ))}
      </div>
      <div className="split-scale" aria-hidden="true"><span>0</span><span>{split.totalLabel}</span></div>

      <ul className="split-legend" aria-hidden="true">
        {split.segments.map((segment) => (
          <li key={segment.id} style={{ '--segment': segment.color } as CSSProperties}>
            <i />
            <span className="split-legend-label">{segment.label}</span>
            <strong>{segment.amount}</strong>
            <small>{segment.shareText}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
