import type { OverviewProps } from '../../types';
import { buildCustomerRows, buildFinancialRows } from '../../utils/chartData';
import { buildCustomerTable, buildFinancialTable } from '../../utils/chartTables';
import { formatCompactMoney, formatMoney, formatPercent, formatWholeNumber } from '../../utils/format';
import { buildCalculations } from '../../utils/metricCalculations';
import { calculateMetrics } from '../../utils/metrics';
import { buildStatTiles } from '../../utils/statTiles';
import { AmountBarChart } from '../charts/AmountBarChart';
import { ShareDonutChart } from '../charts/ShareDonutChart';
import { ChartCard } from '../common/ChartCard';
import { AnswersCard } from './AnswersCard';
import { ExchangeRateNote } from './ExchangeRateNote';
import { HeroCard } from './HeroCard';
import { StatTile } from './StatTile';

export function Overview({ answers, isSample, currency, isConversionUnavailable, rate, onAnswersChange, onClearAnswers }: OverviewProps) {
  const metrics = calculateMetrics(answers, currency, rate);
  const calculations = buildCalculations(metrics, answers, currency, rate);
  const customerRows = buildCustomerRows(metrics);
  const { customerTiles, atRiskTiles } = buildStatTiles(metrics, calculations);

  return (
    <div className="overview">
      <div className="filter-row">
        <span className="period-chip">Past 12 months</span>
        <span className="filter-note">All amounts in {currency}</span>
        <ExchangeRateNote enteredCurrency={answers.currency} currency={currency} rate={rate} isConversionUnavailable={isConversionUnavailable} />
      </div>

      <div className="bento">
        <HeroCard metrics={metrics} answers={answers} currency={currency} rate={rate} />

        <div className="tiles span-4">
          {customerTiles.map((tile) => <StatTile key={tile.id} tile={tile} />)}
        </div>

        <div className="tiles-wide span-12">
          {atRiskTiles.map((tile) => <StatTile key={tile.id} tile={tile} />)}
        </div>

        <ChartCard
          className="span-7"
          title="Revenue, expenses and net profit"
          subtitle={`Past 12 months, in ${currency}`}
          table={buildFinancialTable(metrics, currency)}
        >
          <AmountBarChart
            rows={buildFinancialRows(metrics)}
            format={(value) => formatMoney(value, currency)}
            tickFormat={(value) => formatCompactMoney(value, currency)}
            height={290}
            ariaLabel={`Revenue ${formatMoney(metrics.revenue, currency)}, expenses ${formatMoney(metrics.expenses, currency)}, net profit ${formatMoney(metrics.netProfit, currency)}`}
          />
        </ChartCard>

        <ChartCard
          className="span-5"
          title="Customers retained and lost"
          subtitle={`${formatWholeNumber(metrics.totalCustomers)} total customers, past 12 months`}
          legend={customerRows.map((row) => ({ name: row.name, color: row.color }))}
          table={buildCustomerTable(metrics)}
        >
          <ShareDonutChart
            rows={customerRows}
            format={formatWholeNumber}
            centerValue={formatPercent(metrics.retentionRate)}
            centerLabel="retained"
            height={262}
            ariaLabel={`${formatPercent(metrics.retentionRate)} of customers retained, ${formatPercent(metrics.churnRate)} lost`}
          />
        </ChartCard>

        {!isSample && <AnswersCard answers={answers} onChange={onAnswersChange} onClear={onClearAnswers} />}
      </div>
    </div>
  );
}
