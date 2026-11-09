import type { MetricTerm, MetricTermKey } from '../types';

/**
 * Every plain-language explanation and calculation shown in the UI lives here.
 * Each formula describes the matching code in metrics.ts or forecast.ts.
 */
export const METRIC_TERMS: Record<MetricTermKey, MetricTerm> = {
  arr: {
    term: 'ARR',
    explanation: 'Annual Recurring Revenue - the yearly value of your active subscriptions.',
    formula: 'Latest month\'s MRR × 12',
  },
  mrr: {
    term: 'MRR',
    explanation: 'Monthly Recurring Revenue - predictable subscription income each month.',
    formula: 'The MRR you entered for the latest month',
  },
  revenue: {
    term: 'Revenue in period',
    explanation: 'All income earned in the selected period.',
    formula: 'Sum of each month\'s revenue in the period',
  },
  totalCosts: {
    term: 'Total costs',
    explanation: 'Everything spent running the business in the selected period.',
    formula: 'Sum of each month\'s COGS, sales and marketing, and other costs',
  },
  netProfit: {
    term: 'Net profit',
    explanation: 'What is left after subtracting all costs from revenue.',
    formula: 'Revenue - Total costs',
  },
  roi: {
    term: 'ROI',
    explanation: 'Return on Investment - profit earned for every dollar spent.',
    formula: '(Net profit / Total costs) × 100',
  },
  churnRate: {
    term: 'Churn rate',
    explanation: 'Share of customers who leave each month. Lower is better.',
    formula: '(Customers lost / Sum of customers at the start of each month) × 100',
  },
  customersLost: {
    term: 'Customers lost',
    explanation: 'Customers who cancelled during this period.',
    formula: 'Sum of each month\'s customers lost in the period',
  },
  activeCustomers: {
    term: 'Active customers',
    explanation: 'Customers still with you at the end of this period.',
    formula: 'The customer count you entered for the latest month',
  },
  newCustomers: {
    term: 'New customers',
    explanation: 'Customers won for the first time in this period.',
    formula: 'Sum of each month\'s new customers in the period',
  },
  arpa: {
    term: 'ARPA',
    explanation: 'Average Revenue Per Account - the average monthly revenue from each customer account.',
    formula: 'Latest month\'s MRR / Latest month\'s active customers',
  },
  cac: {
    term: 'CAC',
    explanation: 'Customer Acquisition Cost - the average sales and marketing spend to win one customer.',
    formula: 'Sales and marketing spend / New customers',
  },
  ltvCac: {
    term: 'LTV : CAC',
    explanation: 'Lifetime Value to CAC - profit from a customer over time, compared with the cost of winning them.',
    formula: 'LTV / CAC, where LTV = (ARPA × Gross margin) / Churn rate',
  },
  cacPayback: {
    term: 'CAC payback',
    explanation: 'Months of gross profit needed to earn back the cost of winning a customer.',
    formula: 'CAC / (ARPA × Gross margin)',
  },
  netMargin: {
    term: 'Net margin',
    explanation: 'Share of revenue kept as profit after all costs.',
    formula: '(Net profit / Revenue) × 100',
  },
  grossMargin: {
    term: 'Gross margin',
    explanation: 'Share of revenue left after the direct cost of delivering your product.',
    formula: '((Revenue - COGS) / Revenue) × 100',
  },
  cogs: {
    term: 'COGS',
    explanation: 'Cost of Goods Sold - the direct cost of delivering your product or service.',
    formula: 'The direct costs you entered',
  },
  arrForecast: {
    term: 'ARR scenario',
    explanation: 'Projected Annual Recurring Revenue under your assumptions.',
    formula: 'Each month: Customers = Customers × (1 - Churn rate) + New customers. ARR = Customers × ARPA × 12',
  },
};
