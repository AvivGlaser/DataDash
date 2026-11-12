import type { BusinessAnswers, BusinessMetrics, Currency, ExchangeRate, MetricCalculation, MetricTermKey, PeriodChange, TrendSubject } from '../types';
import { describeRate } from './currency';
import { formatMoney, formatPercent, formatSignedPercent, formatUnitMoney, formatWholeNumber } from './format';
import { METRIC_TERMS } from './metricTerms';

const TREND_WORDS = { increased: 'went up', decreased: 'went down', same: 'stayed roughly the same' } as const;

/**
 * Without the earlier amount there is no calculation, so the tooltip says what the answer was instead of showing a formula.
 */
function describeUncalculatedChange(subject: TrendSubject, change: PeriodChange): string | null {
  if (change.percent !== null) return null;
  if (change.trend === 'unsure') return `You were not sure how your ${subject} compared, so no change is shown.`;
  if (change.trend === 'exact') return null;
  return `Your own answer: your ${subject} ${TREND_WORDS[change.trend]}. No percentage is shown, because the earlier amount was not entered.`;
}

/** Builds the question mark tooltip content for each metric, using the numbers on screen. */
export function buildCalculations(
  metrics: BusinessMetrics,
  answers: BusinessAnswers,
  currency: Currency,
  rate: ExchangeRate | null,
): Record<MetricTermKey, MetricCalculation> {
  const money = (amount: number) => formatMoney(amount, currency);
  const unitMoney = (amount: number) => formatUnitMoney(amount, currency);
  const conversionOf = (enteredAmount: number | null, format = formatMoney) => (enteredAmount !== null && answers.currency !== currency && rate
    ? `${format(enteredAmount, answers.currency)} converted at ${describeRate(rate)}`
    : null);
  const shareOf = (part: number, percent: number) =>
    `(${formatWholeNumber(part)} / ${formatWholeNumber(metrics.totalCustomers)}) × 100 = ${formatPercent(percent)}`;

  const changeWorked = (current: number, change: PeriodChange) => (change.percent === null || change.previous === null
    ? null
    : `((${money(current)} - ${money(change.previous)}) / ${money(change.previous)}) × 100 = ${formatSignedPercent(change.percent)}`);

  const workedByMetric: Record<MetricTermKey, string | null> = {
    revenue: conversionOf(answers.revenue),
    expenses: conversionOf(answers.expenses),
    netProfit: `${money(metrics.revenue)} - ${money(metrics.expenses)} = ${money(metrics.netProfit)}`,
    netProfitMargin: `(${money(metrics.netProfit)} / ${money(metrics.revenue)}) × 100 = ${formatPercent(metrics.netProfitMargin)}`,
    revenueChange: changeWorked(metrics.revenue, metrics.revenueChange),
    expensesChange: changeWorked(metrics.expenses, metrics.expensesChange),
    customersLost: null,
    customersRetained: null,
    churnRate: shareOf(metrics.customersLost, metrics.churnRate),
    retentionRate: shareOf(metrics.customersRetained, metrics.retentionRate),
    customersAtRisk: null,
    customersSaved: null,
    saveRate: metrics.saveRate === null
      ? null
      : `(${formatWholeNumber(metrics.customersSaved)} / ${formatWholeNumber(metrics.customersAtRisk)}) × 100 = ${formatPercent(metrics.saveRate)}`,
    costPerSale: conversionOf(answers.costPerSale, formatUnitMoney),
    profitPerSale: conversionOf(answers.profitPerSale, formatUnitMoney),
    pricePerSale: metrics.pricePerSale === null || metrics.costPerSale === null || metrics.profitPerSale === null
      ? null
      : `${unitMoney(metrics.costPerSale)} + ${unitMoney(metrics.profitPerSale)} = ${unitMoney(metrics.pricePerSale)}`,
  };

  const keys = Object.keys(METRIC_TERMS) as MetricTermKey[];
  const formulaByMetric: Partial<Record<MetricTermKey, string | null>> = {
    revenueChange: describeUncalculatedChange('revenue', metrics.revenueChange),
    expensesChange: describeUncalculatedChange('expenses', metrics.expensesChange),
  };
  const entries = keys.map((key) => [key, { term: METRIC_TERMS[key].term, formula: formulaByMetric[key] ?? METRIC_TERMS[key].formula, worked: workedByMetric[key] }]);
  return Object.fromEntries(entries);
}
