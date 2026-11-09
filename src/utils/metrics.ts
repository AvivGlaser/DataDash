import type { BusinessAnswers, BusinessMetrics, Currency, ExchangeRate } from '../types';
import { convertAmount } from './currency';

/** Every formula here is described in words in metricTerms.ts. Keep the two in step. */
export function calculateMetrics(answers: BusinessAnswers, currency: Currency, rate: ExchangeRate | null): BusinessMetrics {
  const revenue = convertAmount(answers.revenue, answers.currency, currency, rate);
  const expenses = convertAmount(answers.expenses, answers.currency, currency, rate);
  const netProfit = revenue - expenses;
  const { customersLost, customersRetained, customersAtRisk, customersSaved } = answers;
  const totalCustomers = customersLost + customersRetained;

  return {
    revenue,
    expenses,
    netProfit,
    netProfitMargin: (netProfit / revenue) * 100,
    customersLost,
    customersRetained,
    totalCustomers,
    churnRate: (customersLost / totalCustomers) * 100,
    retentionRate: (customersRetained / totalCustomers) * 100,
    customersAtRisk,
    customersSaved,
    saveRate: customersAtRisk > 0 ? (customersSaved / customersAtRisk) * 100 : null,
  };
}
