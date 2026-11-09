import type { MonthRecord, Targets } from '../types';
import { addMonths, getCurrentMonth } from './format';

export const DEFAULT_TARGETS: Targets = { arr: 12_000_000, roi: 0.2, churn: 0.02, ltvCac: 6, customers: 2000 };

/** Small fixed month-to-month wobble, so the sample looks natural but never changes between loads. */
const MONTHLY_VARIATION = [3, -2, 5, -4, 1, 6, -3, 2, -5, 4, 0, -1, 7, -6, 2, 3, -2, 5, -3, 1, 4, -4, 2, 6];
const SAMPLE_MONTHS = 24;
const PRICE_CHANGE_MONTH = 13;

/** Fictional SaaS history ending last month, with a churn spike after a price change. */
export function createSampleData(): MonthRecord[] {
  const currentMonth = getCurrentMonth();
  const records: MonthRecord[] = [];
  let customers = 820;

  for (let monthNumber = 0; monthNumber < SAMPLE_MONTHS; monthNumber++) {
    const variation = MONTHLY_VARIATION[monthNumber];
    const churnSpike = monthNumber === PRICE_CHANGE_MONTH ? 0.021 : monthNumber === PRICE_CHANGE_MONTH + 1 ? 0.012 : 0;
    const churnRate = 0.037 - monthNumber * 0.00065 + variation * 0.00012 + churnSpike;
    const newCustomers = Math.round(58 + monthNumber * 1.6 + variation);
    const churnedCustomers = Math.round(customers * churnRate);
    customers += newCustomers - churnedCustomers;

    const arpa = 410 + monthNumber * 4.8 + (monthNumber >= PRICE_CHANGE_MONTH ? 18 : 0);
    const mrr = Math.round(customers * arpa);
    const revenue = Math.round(mrr * (1.07 + variation * 0.002));
    const salesMarketing = Math.round(newCustomers * (3200 + variation * 22));
    const cogs = Math.round(revenue * 0.22);

    records.push({
      month: addMonths(currentMonth, monthNumber - SAMPLE_MONTHS),
      mrr,
      revenue,
      customers,
      newCustomers,
      churnedCustomers,
      salesMarketing,
      cogs,
      totalCosts: salesMarketing + cogs + Math.round(revenue * 0.26 + 40000),
    });
  }
  return records;
}
