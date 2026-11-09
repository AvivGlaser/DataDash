import { useState } from 'react';
import type { MetricSummary, OverviewProps } from '../../types';
import { buildMonthlyRows } from '../../utils/chartData';
import { buildChurnTable, buildCustomerMovementTable, buildRevenueTable } from '../../utils/chartTables';
import { getForecastBaseline } from '../../utils/forecast';
import { formatCompactCount, formatMoney, formatMonthLabel, formatPercentTick, formatPercentTwoDecimals, formatPercentValue, formatWholeNumber } from '../../utils/format';
import { getComparisonWindows, summarizeMonths } from '../../utils/metrics';
import { buildStatTiles } from '../../utils/statTiles';
import { ColumnChart } from '../charts/ColumnChart';
import { TrendLineChart } from '../charts/TrendLineChart';
import { ChartCard } from '../common/ChartCard';
import { HeroCard } from './HeroCard';
import { ScenarioPlanner } from './ScenarioPlanner';
import { StatTile } from './StatTile';
import { TargetsCard } from './TargetsCard';
import { TrendPrompt } from './TrendPrompt';

const REVENUE_COLOR = 'var(--series-in)';
const OUTFLOW_COLOR = 'var(--series-out)';
const NEW_CUSTOMERS_COLOR = 'var(--series-gain)';

const ALL_MONTHS = 0;
const TIME_RANGES = [
  { label: '6M', months: 6 },
  { label: '12M', months: 12 },
  { label: '24M', months: 24 },
  { label: 'All', months: ALL_MONTHS },
];
const MINIMUM_TREND_MONTHS = 2;

export function Overview({ records, businessModel, targets, onTargetsChange, onAddMonth }: OverviewProps) {
  const [selectedRange, setSelectedRange] = useState(12);

  const availableRanges = TIME_RANGES.filter((range) => range.months === ALL_MONTHS || range.months < records.length);
  const activeRange = availableRanges.some((range) => range.months === selectedRange) ? selectedRange : ALL_MONTHS;

  const { current, prior } = getComparisonWindows(records, activeRange);
  const summary = summarizeMonths(current) as MetricSummary;
  const priorSummary = prior ? summarizeMonths(prior) : null;
  const lastRecord = current[current.length - 1];
  const rows = buildMonthlyRows(current);
  const comparisonLabel = prior ? `vs prior ${activeRange} mo` : '';
  const netCustomers = summary.newCustomers - summary.churned;

  const isRecurring = businessModel !== 'oneTime';
  const hasTrends = current.length >= MINIMUM_TREND_MONTHS;
  const { topTiles, bottomTiles } = buildStatTiles(businessModel, summary, priorSummary, current);
  const forecastBaseline = isRecurring && hasTrends ? getForecastBaseline(summary) : null;
  const tileProps = { comparisonLabel, onAddMonth };

  return (
    <div className="overview">
      <div className="filter-row">
        {availableRanges.length > 1 && (
          <div className="segmented" role="group" aria-label="Time range">
            {availableRanges.map((range) => (
              <button key={range.label} aria-pressed={activeRange === range.months} onClick={() => setSelectedRange(range.months)}>{range.label}</button>
            ))}
          </div>
        )}
        <span className="filter-note">
          {formatMonthLabel(current[0].month)} to {formatMonthLabel(lastRecord.month)} · {current.length} {current.length === 1 ? 'month' : 'months'}
        </span>
      </div>

      <div className="bento">
        <HeroCard summary={summary} priorSummary={priorSummary} comparisonLabel={comparisonLabel} isRecurring={isRecurring} rows={rows} />

        <div className="tiles span-4">
          {topTiles.map((tile) => <StatTile key={tile.id} tile={tile} {...tileProps} />)}
        </div>

        {hasTrends ? (
          <ChartCard
            className={isRecurring ? 'span-7' : 'span-12'}
            title="Revenue and costs"
            subtitle="Monthly, in dollars"
            legend={[{ name: 'Revenue', color: REVENUE_COLOR }, { name: 'Total costs', color: OUTFLOW_COLOR }]}
            table={buildRevenueTable(current)}
          >
            <TrendLineChart
              rows={rows}
              series={[
                { dataKey: 'revenue', name: 'Revenue', color: REVENUE_COLOR },
                { dataKey: 'totalCosts', name: 'Total costs', color: OUTFLOW_COLOR },
              ]}
              format={formatMoney}
              height={310}
              ariaLabel="Monthly revenue and total costs"
            />
          </ChartCard>
        ) : (
          <TrendPrompt className={isRecurring ? 'span-7' : 'span-12'} isRecurring={isRecurring} onAddMonth={onAddMonth} />
        )}

        {isRecurring && <TargetsCard summary={summary} targets={targets} onSave={onTargetsChange} />}

        {isRecurring && hasTrends && (
          <>
            <ChartCard
              className="span-7"
              title="Customer churn"
              subtitle={`Customers who cancelled: ${formatWholeNumber(summary.churned)} in this period, ${formatPercentTwoDecimals(summary.churnRate)} a month on average`}
              table={buildChurnTable(current)}
            >
              <div className="multiples">
                <div>
                  <h3>Churn rate, % of customers per month</h3>
                  <TrendLineChart
                    rows={rows}
                    series={[{ dataKey: 'churnPercent', name: 'Churn rate', color: OUTFLOW_COLOR }]}
                    format={formatPercentValue}
                    tickFormat={formatPercentTick}
                    threshold={targets.churn === null ? undefined : { value: targets.churn * 100, label: `Target ${formatPercentTick(targets.churn * 100)}` }}
                    height={275}
                    ariaLabel="Monthly churn rate percentage"
                  />
                </div>
                <div>
                  <h3>Customers lost per month</h3>
                  <ColumnChart
                    rows={rows}
                    series={[{ dataKey: 'churnedCustomers', name: 'Customers lost', color: OUTFLOW_COLOR }]}
                    format={formatWholeNumber}
                    height={275}
                    ariaLabel="Number of customers lost per month"
                  />
                </div>
              </div>
            </ChartCard>

            <ChartCard
              className="span-5"
              title="Customer movement"
              subtitle={`Net ${netCustomers >= 0 ? '+' : ''}${formatWholeNumber(netCustomers)} customers in this period`}
              legend={[{ name: 'New customers', color: NEW_CUSTOMERS_COLOR }, { name: 'Churned customers', color: OUTFLOW_COLOR }]}
              table={buildCustomerMovementTable(current)}
            >
              <ColumnChart
                rows={rows}
                series={[
                  { dataKey: 'newCustomers', name: 'New', color: NEW_CUSTOMERS_COLOR },
                  { dataKey: 'churnedBelowAxis', name: 'Churned', color: OUTFLOW_COLOR },
                ]}
                format={formatCompactCount}
                height={270}
                ariaLabel="New and churned customers per month"
              />
            </ChartCard>
          </>
        )}

        {bottomTiles.length > 0 && (
          <div className="tiles-row span-12">
            {bottomTiles.map((tile) => <StatTile key={tile.id} tile={tile} {...tileProps} />)}
          </div>
        )}

        {forecastBaseline && (
          <ScenarioPlanner key={`${lastRecord.month}-${current.length}-${summary.churned}-${summary.newCustomers}-${summary.mrr}`} lastRecord={lastRecord} baseline={forecastBaseline} />
        )}
      </div>
    </div>
  );
}
