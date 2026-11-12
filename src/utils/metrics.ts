import type { BusinessAnswers, BusinessMetrics, Currency, ExchangeRate, PeriodChange, TrendChoice } from '../types';
import { convertAmount } from './currency';

/**
 * A percent change exists only when the earlier amount was entered. A "went up" or "went down"
 * answer stays a direction: no percentage is ever made up for it.
 */
function buildChange(trend: TrendChoice, previous: number | null, current: number): PeriodChange {
  const knownPrevious = trend === 'exact' && previous !== null && previous > 0 ? previous : null;
  return { trend, previous: knownPrevious, percent: knownPrevious === null ? null : ((current - knownPrevious) / knownPrevious) * 100 };
}

/** Every formula here is described in words in metricTerms.ts. Keep the two in step. */
export function calculateMetrics(answers: BusinessAnswers, currency: Currency, rate: ExchangeRate | null): BusinessMetrics {
  const convert = (amount: number) => convertAmount(amount, answers.currency, currency, rate);
  const convertOptional = (amount: number | null) => (amount === null ? null : convert(amount));
  const revenue = convert(answers.revenue);
  const expenses = convert(answers.expenses);
  const netProfit = revenue - expenses;

  const hasCustomerData = answers.customersLost !== null && answers.customersRetained !== null;
  const customersLost = answers.customersLost ?? 0;
  const customersRetained = answers.customersRetained ?? 0;
  const customersAtRisk = answers.customersAtRisk ?? 0;
  const customersSaved = answers.customersSaved ?? 0;
  const totalCustomers = customersLost + customersRetained;
  const shareOfCustomers = (part: number) => (totalCustomers > 0 ? (part / totalCustomers) * 100 : 0);

  const costPerSale = convertOptional(answers.costPerSale);
  const profitPerSale = convertOptional(answers.profitPerSale);

  return {
    revenue,
    revenueIsEstimate: answers.revenueIsEstimate,
    revenueChange: buildChange(answers.revenueTrend, convertOptional(answers.previousRevenue), revenue),
    expenses,
    expensesIsEstimate: answers.expensesIsEstimate,
    expensesChange: buildChange(answers.expensesTrend, convertOptional(answers.previousExpenses), expenses),
    netProfit,
    netProfitMargin: (netProfit / revenue) * 100,
    hasCustomerData,
    customersLost,
    customersRetained,
    totalCustomers,
    churnRate: shareOfCustomers(customersLost),
    retentionRate: shareOfCustomers(customersRetained),
    customersAtRisk,
    customersSaved,
    saveRate: hasCustomerData && customersAtRisk > 0 ? (customersSaved / customersAtRisk) * 100 : null,
    costPerSale,
    profitPerSale,
    pricePerSale: costPerSale !== null && profitPerSale !== null ? costPerSale + profitPerSale : null,
  };
}
