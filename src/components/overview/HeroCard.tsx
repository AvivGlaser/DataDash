import type { HeroCardProps, HeroFactData } from '../../types';
import { formatMoney, formatPercent } from '../../utils/format';
import { buildCalculations } from '../../utils/metricCalculations';
import { METRIC_TERMS } from '../../utils/metricTerms';
import { getValueFitStyle } from '../../utils/valueFit';
import { AnimatedNumber } from '../common/AnimatedNumber';
import { MetricHelp } from '../common/MetricHelp';

export function HeroCard({ metrics, answers, currency, rate }: HeroCardProps) {
  const calculations = buildCalculations(metrics, answers, currency, rate);
  const facts: HeroFactData[] = [
    { id: 'revenue', label: METRIC_TERMS.revenue.term, note: METRIC_TERMS.revenue.explanation, value: formatMoney(metrics.revenue, currency), calculation: calculations.revenue },
    { id: 'expenses', label: METRIC_TERMS.expenses.term, note: METRIC_TERMS.expenses.explanation, value: formatMoney(metrics.expenses, currency), calculation: calculations.expenses },
    { id: 'margin', label: METRIC_TERMS.netProfitMargin.term, note: METRIC_TERMS.netProfitMargin.explanation, value: formatPercent(metrics.netProfitMargin), calculation: calculations.netProfitMargin },
  ];

  return (
    <section className={`card hero span-8 no-chart ${metrics.netProfit < 0 ? 'loss' : ''}`}>
      <MetricHelp calculation={calculations.netProfit} />
      <div className="hero-copy">
        <h2>{METRIC_TERMS.netProfit.term}</h2>
        <p className="term-note">{METRIC_TERMS.netProfit.explanation}</p>
        <div className="hero-value" style={getValueFitStyle(formatMoney(metrics.netProfit, currency))}><AnimatedNumber value={metrics.netProfit} format={(value) => formatMoney(value ?? 0, currency)} /></div>
        <dl className="hero-facts">
          {facts.map((fact) => (
            <div key={fact.id}>
              <dt>{fact.label}<MetricHelp calculation={fact.calculation} /></dt>
              <dd>{fact.value}</dd>
              <dd className="term-note">{fact.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
