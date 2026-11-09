import type { HeroCardProps, HeroFactProps } from '../../types';
import { formatMoney, formatWholeNumber } from '../../utils/format';
import { getMetricCalculation } from '../../utils/metricCalculations';
import { METRIC_TERMS } from '../../utils/metricTerms';
import { calculateChange } from '../../utils/metrics';
import { TrendLineChart } from '../charts/TrendLineChart';
import { AnimatedNumber } from '../common/AnimatedNumber';
import { ChangeIndicator } from '../common/ChangeIndicator';
import { MetricHelp } from '../common/MetricHelp';

const HERO_LINE_COLOR = 'var(--hero-ink)';
const MINIMUM_TREND_MONTHS = 2;

function HeroFact({ calculation, label = calculation.term, value, note }: HeroFactProps) {
  return (
    <div>
      <dt>{label}<MetricHelp calculation={calculation} /></dt>
      <dd>{value}</dd>
      <dd className="term-note">{note}</dd>
    </div>
  );
}

export function HeroCard({ summary, priorSummary, comparisonLabel, isRecurring, rows }: HeroCardProps) {
  const heroKey = isRecurring ? 'arr' : 'revenue';
  const heroValue = isRecurring ? summary.arr : summary.revenue;
  const previousValue = priorSummary ? (isRecurring ? priorSummary.arr : priorSummary.revenue) : null;
  const heroTerm = METRIC_TERMS[heroKey];
  const hasTrend = rows.length >= MINIMUM_TREND_MONTHS;
  const calculationFor = (metricKey: 'mrr' | 'revenue' | 'netProfit' | 'totalCosts' | 'newCustomers') => getMetricCalculation(metricKey, summary);

  return (
    <section className={`card hero span-8 ${hasTrend ? '' : 'no-chart'}`}>
      <MetricHelp calculation={getMetricCalculation(heroKey, summary)} />
      <div className="hero-copy">
        <h2>{heroTerm.term}</h2>
        <p className="term-note">{heroTerm.explanation}</p>
        <div className="hero-value"><AnimatedNumber value={heroValue} format={formatMoney} /></div>
        <ChangeIndicator change={calculateChange(heroValue, previousValue, true, 'relative')} comparisonLabel={comparisonLabel} />
        <dl className="hero-facts">
          {isRecurring ? (
            <>
              <HeroFact calculation={calculationFor('mrr')} value={formatMoney(summary.mrr)} note="Monthly Recurring Revenue" />
              <HeroFact calculation={calculationFor('revenue')} label="Revenue" value={formatMoney(summary.revenue)} note="All income earned" />
            </>
          ) : (
            <>
              <HeroFact calculation={calculationFor('totalCosts')} value={formatMoney(summary.costs)} note="Everything spent" />
              <HeroFact calculation={calculationFor('newCustomers')} value={formatWholeNumber(summary.newCustomers)} note="First-time buyers" />
            </>
          )}
          <HeroFact calculation={calculationFor('netProfit')} value={formatMoney(summary.profit)} note="Revenue minus all costs" />
        </dl>
      </div>
      {hasTrend && (
        <div className="hero-chart">
          <TrendLineChart
            rows={rows}
            series={[{ dataKey: isRecurring ? 'arr' : 'revenue', name: heroTerm.term, color: HERO_LINE_COLOR }]}
            format={formatMoney}
            showArea
            height={230}
            ariaLabel={`${heroTerm.term} by month, ending at ${formatMoney(heroValue)}`}
          />
        </div>
      )}
    </section>
  );
}
