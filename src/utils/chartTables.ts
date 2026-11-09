import type { BusinessMetrics, Currency, TableData } from '../types';
import { formatMoney, formatPercent, formatWholeNumber } from './format';

/** The table twin of each chart, for reading exact values. */
export function buildFinancialTable(metrics: BusinessMetrics, currency: Currency): TableData {
  return {
    headers: ['Measure', `Past 12 months (${currency})`],
    rows: [
      ['Revenue', formatMoney(metrics.revenue, currency)],
      ['Expenses', formatMoney(metrics.expenses, currency)],
      ['Net Profit', formatMoney(metrics.netProfit, currency)],
    ],
  };
}

export function buildCustomerTable(metrics: BusinessMetrics): TableData {
  return {
    headers: ['Customers', 'Number', 'Share'],
    rows: [
      ['Retained', formatWholeNumber(metrics.customersRetained), formatPercent(metrics.retentionRate)],
      ['Lost', formatWholeNumber(metrics.customersLost), formatPercent(metrics.churnRate)],
    ],
  };
}
