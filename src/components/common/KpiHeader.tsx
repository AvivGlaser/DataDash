import type { KpiHeaderProps } from '../../types';
import { Icon } from './Icon';
import { MetricHelp } from './MetricHelp';

/** The top of every metric card: icon, name, the ? tooltip, and a one-line explanation. */
export function KpiHeader({ metric, calculation, iconSize = 18 }: KpiHeaderProps) {
  return (
    <>
      <header className="kpi-head">
        <span className="kpi-icon"><Icon name={metric.icon} size={iconSize} /></span>
        <h2>{metric.term}</h2>
        <MetricHelp calculation={calculation} />
      </header>
      <p className="term-note">{metric.explanation}</p>
    </>
  );
}
