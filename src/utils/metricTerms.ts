import type { MetricTerm, MetricTermKey } from '../types';

/**
 * Every plain-language explanation and calculation shown in the UI lives here.
 * Each formula describes the matching code in metrics.ts.
 */
export const METRIC_TERMS: Record<MetricTermKey, MetricTerm> = {
  revenue: {
    term: 'Revenue',
    explanation: 'All income earned over the past 12 months.',
    formula: 'The total revenue you entered for the past 12 months',
  },
  expenses: {
    term: 'Expenses',
    explanation: 'Everything spent running the business over the past 12 months.',
    formula: 'The total expenses you entered for the past 12 months',
  },
  netProfit: {
    term: 'Net Profit',
    explanation: 'What is left after subtracting all expenses from revenue.',
    formula: 'Revenue - Expenses',
  },
  netProfitMargin: {
    term: 'Net Profit Margin',
    explanation: 'The share of revenue kept as profit.',
    formula: '(Net Profit / Revenue) × 100',
  },
  customersLost: {
    term: 'Customers lost',
    explanation: 'Customers who left over the past 12 months.',
    formula: 'The number of lost customers you entered',
  },
  customersRetained: {
    term: 'Customers retained',
    explanation: 'Customers who stayed with you over the past 12 months.',
    formula: 'The number of retained customers you entered',
  },
  churnRate: {
    term: 'Customer Churn Rate',
    explanation: 'The percentage of customers lost. Lower is better.',
    formula: '(Customers lost / Total customers) × 100, where Total customers = Customers lost + Customers retained',
  },
  retentionRate: {
    term: 'Customer Retention Rate',
    explanation: 'The percentage of customers retained. Higher is better.',
    formula: '(Customers retained / Total customers) × 100, where Total customers = Customers lost + Customers retained',
  },
  customersAtRisk: {
    term: 'At-risk customers',
    explanation: 'Customers who wanted to leave over the past 12 months.',
    formula: 'The number of at-risk customers you entered',
  },
  customersSaved: {
    term: 'Customers saved',
    explanation: 'At-risk customers who decided to stay.',
    formula: 'The number of saved customers you entered',
  },
  saveRate: {
    term: 'Save Rate',
    explanation: 'The percentage of at-risk customers you kept. Higher is better.',
    formula: '(Customers saved / At-risk customers) × 100',
  },
};
