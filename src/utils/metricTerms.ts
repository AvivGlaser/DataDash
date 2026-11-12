import type { MetricTerm, MetricTermKey } from '../types';

/**
 * Every plain-language explanation and calculation shown in the UI lives here.
 * Each formula describes the matching code in metrics.ts.
 * Explanations stay to one short line; the period (past 12 months) is shown once at the top of the dashboard.
 */
export const METRIC_TERMS: Record<MetricTermKey, MetricTerm> = {
  revenue: {
    term: 'Revenue',
    explanation: 'All income earned.',
    formula: 'The total revenue you entered for the past 12 months',
    icon: 'trendUp',
  },
  expenses: {
    term: 'Expenses',
    explanation: 'Everything spent running the business.',
    formula: 'The total expenses you entered for the past 12 months',
    icon: 'receipt',
  },
  netProfit: {
    term: 'Net Profit',
    explanation: 'What is left after all expenses.',
    formula: 'Revenue - Expenses',
    icon: 'moneyBag',
  },
  netProfitMargin: {
    term: 'Net Profit Margin',
    explanation: 'Share of revenue kept as profit.',
    formula: '(Net Profit / Revenue) × 100',
    icon: 'percent',
  },
  revenueChange: {
    term: 'Revenue change',
    explanation: 'Compared with the 12 months before.',
    formula: '((Revenue - Earlier revenue) / Earlier revenue) × 100',
    icon: 'trendUp',
  },
  expensesChange: {
    term: 'Expenses change',
    explanation: 'Compared with the 12 months before.',
    formula: '((Expenses - Earlier expenses) / Earlier expenses) × 100',
    icon: 'receipt',
  },
  customersLost: {
    term: 'Customers lost',
    explanation: 'Customers who left.',
    formula: 'The number of lost customers you entered',
    icon: 'userMinus',
  },
  customersRetained: {
    term: 'Customers retained',
    explanation: 'Customers who stayed.',
    formula: 'The number of retained customers you entered',
    icon: 'userCheck',
  },
  churnRate: {
    term: 'Customer Churn Rate',
    explanation: 'Share of customers lost. Good below 30%.',
    formula: '(Customers lost / Total customers) × 100, where Total customers = Customers lost + Customers retained',
    icon: 'trendDown',
  },
  retentionRate: {
    term: 'Customer Retention Rate',
    explanation: 'Share of customers kept. Good above 70%.',
    formula: '(Customers retained / Total customers) × 100, where Total customers = Customers lost + Customers retained',
    icon: 'repeat',
  },
  customersAtRisk: {
    term: 'At-risk customers',
    explanation: 'Customers who wanted to leave.',
    formula: 'The number of at-risk customers you entered',
    icon: 'userAlert',
  },
  customersSaved: {
    term: 'Customers saved',
    explanation: 'At-risk customers who stayed.',
    formula: 'The number of saved customers you entered',
    icon: 'lifebuoy',
  },
  saveRate: {
    term: 'Save Rate',
    explanation: 'Share of at-risk customers you kept. Good above 50%.',
    formula: '(Customers saved / At-risk customers) × 100',
    icon: 'shield',
  },
  costPerSale: {
    term: 'Cost per sale',
    explanation: 'Direct cost of one sale, on average.',
    formula: 'The cost per sale you entered',
    icon: 'box',
  },
  profitPerSale: {
    term: 'Profit per sale',
    explanation: 'What you keep from one sale, on average.',
    formula: 'The profit per sale you entered',
    icon: 'coin',
  },
  pricePerSale: {
    term: 'Price per sale',
    explanation: 'What one sale brings in: cost + profit.',
    formula: 'Cost per sale + Profit per sale',
    icon: 'tag',
  },
};
