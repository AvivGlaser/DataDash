import type { MetricCalculation, MetricSummary, MetricTermKey } from '../types';
import { formatMoney, formatMonthCount, formatPercent, formatPercentTwoDecimals, formatRatio, formatWholeNumber } from './format';
import { METRIC_TERMS } from './metricTerms';

const DEFAULT_MISSING_REASON = 'Not enough data to calculate this accurately yet.';
const NEEDS_NEW_CUSTOMERS = 'No new customers in this period, so there is no cost per customer to calculate.';
const NEEDS_SPEND = 'No sales and marketing spend in this period, so a cost per customer would be misleading.';

/** Fills the formula with the same inputs metrics.ts uses. Returns null when an input is missing. */
const WORKED_CALCULATIONS: Partial<Record<MetricTermKey, (summary: MetricSummary) => string | null>> = {
  arr: (summary) => `${formatMoney(summary.mrr)} × 12 = ${formatMoney(summary.arr)}`,
  revenue: (summary) => `${formatMoney(summary.revenue)} over ${summary.monthCount} ${summary.monthCount === 1 ? 'month' : 'months'}`,
  totalCosts: (summary) => `${formatMoney(summary.costs)} over ${summary.monthCount} ${summary.monthCount === 1 ? 'month' : 'months'}`,
  netProfit: (summary) => `${formatMoney(summary.revenue)} - ${formatMoney(summary.costs)} = ${formatMoney(summary.profit)}`,
  roi: (summary) => `(${formatMoney(summary.profit)} / ${formatMoney(summary.costs)}) × 100 = ${formatPercent(summary.roi)}`,
  churnRate: (summary) => `(${formatWholeNumber(summary.churned)} / ${formatWholeNumber(summary.startingCustomers)}) × 100 = ${formatPercentTwoDecimals(summary.churnRate)}`,
  arpa: (summary) => `${formatMoney(summary.mrr)} / ${formatWholeNumber(summary.customers)} = ${formatMoney(summary.arpa)}`,
  cac: (summary) => (summary.cac === null ? null : `${formatMoney(summary.salesMarketing)} / ${formatWholeNumber(summary.newCustomers)} = ${formatMoney(summary.cac)}`),
  ltvCac: (summary) => (summary.ltvCac === null
    ? null
    : `LTV = (${formatMoney(summary.arpa)} × ${formatPercent(summary.grossMargin)}) / ${formatPercentTwoDecimals(summary.churnRate)} = ${formatMoney(summary.ltv)}. ${formatMoney(summary.ltv)} / ${formatMoney(summary.cac)} = ${formatRatio(summary.ltvCac)}`),
  cacPayback: (summary) => (summary.paybackMonths === null
    ? null
    : `${formatMoney(summary.cac)} / (${formatMoney(summary.arpa)} × ${formatPercent(summary.grossMargin)}) = ${formatMonthCount(summary.paybackMonths)}`),
  netMargin: (summary) => `(${formatMoney(summary.profit)} / ${formatMoney(summary.revenue)}) × 100 = ${formatPercent(summary.netMargin)}`,
  grossMargin: (summary) => `((${formatMoney(summary.revenue)} - ${formatMoney(summary.cogs)}) / ${formatMoney(summary.revenue)}) × 100 = ${formatPercent(summary.grossMargin)}`,
};

export function getMetricCalculation(metricKey: MetricTermKey, summary?: MetricSummary): MetricCalculation {
  const { term, formula } = METRIC_TERMS[metricKey];
  const worked = summary ? WORKED_CALCULATIONS[metricKey]?.(summary) ?? null : null;
  return { term, formula, worked };
}

function getCacGap(summary: MetricSummary): string | null {
  if (summary.newCustomers <= 0) return NEEDS_NEW_CUSTOMERS;
  return summary.salesMarketing <= 0 ? NEEDS_SPEND : null;
}

const MISSING_REASONS: Partial<Record<MetricTermKey, (summary: MetricSummary) => string | null>> = {
  churnRate: () => 'No customers at the start of this period, so there is nobody who could have left.',
  cac: getCacGap,
  ltvCac: (summary) => getCacGap(summary)
    ?? (summary.churned === 0 ? 'No customers left in this period, so customer lifetime cannot be estimated yet.' : null),
  cacPayback: (summary) => getCacGap(summary)
    ?? 'Each customer does not yet earn a gross profit, so the cost cannot be paid back.',
};

/** Explains why a metric has no value, in terms the user can act on. */
export const getMissingReason = (metricKey: MetricTermKey, summary: MetricSummary) =>
  MISSING_REASONS[metricKey]?.(summary) ?? DEFAULT_MISSING_REASON;
