import type { BusinessMetrics, ChartDatum } from '../types';

export const buildFinancialRows = (metrics: BusinessMetrics): ChartDatum[] => [
  { name: 'Revenue', value: metrics.revenue, color: 'var(--series-in)' },
  { name: 'Expenses', value: metrics.expenses, color: 'var(--series-out)' },
  { name: 'Net Profit', value: metrics.netProfit, color: metrics.netProfit < 0 ? 'var(--loss)' : 'var(--accent)' },
];

export const buildCustomerRows = (metrics: BusinessMetrics): ChartDatum[] => [
  { name: 'Retained', value: metrics.customersRetained, color: 'var(--series-in)' },
  { name: 'Lost', value: metrics.customersLost, color: 'var(--series-out)' },
];
