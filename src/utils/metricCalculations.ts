import type { BusinessAnswers, BusinessMetrics, Currency, ExchangeRate, MetricCalculation, MetricTermKey } from '../types';
import { describeRate } from './currency';
import { formatMoney, formatPercent, formatWholeNumber } from './format';
import { METRIC_TERMS } from './metricTerms';

/** Builds the question mark tooltip content for each metric, using the numbers on screen. */
export function buildCalculations(
  metrics: BusinessMetrics,
  answers: BusinessAnswers,
  currency: Currency,
  rate: ExchangeRate | null,
): Record<MetricTermKey, MetricCalculation> {
  const money = (amount: number) => formatMoney(amount, currency);
  const conversionOf = (enteredAmount: number) => (answers.currency !== currency && rate
    ? `${formatMoney(enteredAmount, answers.currency)} converted at ${describeRate(rate)}`
    : null);
  const shareOf = (part: number, percent: number) =>
    `(${formatWholeNumber(part)} / ${formatWholeNumber(metrics.totalCustomers)}) × 100 = ${formatPercent(percent)}`;

  const workedByMetric: Record<MetricTermKey, string | null> = {
    revenue: conversionOf(answers.revenue),
    expenses: conversionOf(answers.expenses),
    netProfit: `${money(metrics.revenue)} - ${money(metrics.expenses)} = ${money(metrics.netProfit)}`,
    netProfitMargin: `(${money(metrics.netProfit)} / ${money(metrics.revenue)}) × 100 = ${formatPercent(metrics.netProfitMargin)}`,
    customersLost: null,
    customersRetained: null,
    churnRate: shareOf(metrics.customersLost, metrics.churnRate),
    retentionRate: shareOf(metrics.customersRetained, metrics.retentionRate),
    customersAtRisk: null,
    customersSaved: null,
    saveRate: metrics.saveRate === null
      ? null
      : `(${formatWholeNumber(metrics.customersSaved)} / ${formatWholeNumber(metrics.customersAtRisk)}) × 100 = ${formatPercent(metrics.saveRate)}`,
  };

  const keys = Object.keys(METRIC_TERMS) as MetricTermKey[];
  const entries = keys.map((key) => [key, { term: METRIC_TERMS[key].term, formula: METRIC_TERMS[key].formula, worked: workedByMetric[key] }]);
  return Object.fromEntries(entries);
}
