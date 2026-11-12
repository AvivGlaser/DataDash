import type { HeroCardProps, HeroFactData } from '../../types';
import { formatMoney, formatPercent } from '../../utils/format';
import { buildCalculations } from '../../utils/metricCalculations';
import { METRIC_TERMS } from '../../utils/metricTerms';
import { getProfitStatus } from '../../utils/statTiles';
import { useHoverReplay } from '../../utils/useHoverReplay';
import { getValueFitStyle } from '../../utils/valueFit';
import { AnimatedNumber } from '../common/AnimatedNumber';
import { BasisTag } from '../common/BasisTag';
import { Icon } from '../common/Icon';
import { KpiHeader } from '../common/KpiHeader';
import { MetricHelp } from '../common/MetricHelp';

export function HeroCard({ metrics, answers, currency, rate }: HeroCardProps) {
  const calculations = buildCalculations(metrics, answers, currency, rate);
  const status = getProfitStatus(metrics.netProfit);
  const { replayKey, hoverProps } = useHoverReplay();
  const facts: HeroFactData[] = [
    { id: 'revenue', icon: METRIC_TERMS.revenue.icon, label: METRIC_TERMS.revenue.term, note: METRIC_TERMS.revenue.explanation, value: formatMoney(metrics.revenue, currency), calculation: calculations.revenue },
    { id: 'expenses', icon: METRIC_TERMS.expenses.icon, label: METRIC_TERMS.expenses.term, note: METRIC_TERMS.expenses.explanation, value: formatMoney(metrics.expenses, currency), calculation: calculations.expenses },
    { id: 'margin', icon: METRIC_TERMS.netProfitMargin.icon, label: METRIC_TERMS.netProfitMargin.term, note: METRIC_TERMS.netProfitMargin.explanation, value: formatPercent(metrics.netProfitMargin), calculation: calculations.netProfitMargin },
  ];

  return (
    <section className={`card hero kpi tone-${status.tone}`} {...hoverProps}>
      <KpiHeader metric={METRIC_TERMS.netProfit} calculation={calculations.netProfit} iconSize={22} />
      <div className="hero-main">
        <div className="hero-value" style={getValueFitStyle(formatMoney(metrics.netProfit, currency))}>
          <AnimatedNumber value={metrics.netProfit} format={(value) => formatMoney(value ?? 0, currency)} replayKey={replayKey} />
        </div>
        <span className="kpi-status">{status.label}</span>
        {(metrics.revenueIsEstimate || metrics.expensesIsEstimate) && <BasisTag basis="estimate" />}
      </div>
      <dl className="hero-facts">
        {facts.map((fact) => (
          <div key={fact.id}>
            <dt><Icon name={fact.icon} size={14} />{fact.label}<MetricHelp calculation={fact.calculation} /></dt>
            <dd>{fact.value}</dd>
            <dd className="term-note">{fact.note}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
