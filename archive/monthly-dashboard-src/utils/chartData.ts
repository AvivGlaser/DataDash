import type { ChartRow, MonthRecord } from '../types';
import { formatMonthLabel } from './format';
import { getArr, getChurnPercent } from './metrics';

/** One row per month, holding every value the Overview charts plot. */
export function buildMonthlyRows(records: MonthRecord[]): ChartRow[] {
  return records.map((record) => ({
    label: formatMonthLabel(record.month),
    arr: getArr(record),
    revenue: record.revenue,
    totalCosts: record.totalCosts,
    churnPercent: getChurnPercent(record),
    churnedCustomers: record.churnedCustomers,
    /** Negative so churn draws below the axis, opposite new customers */
    churnedBelowAxis: -record.churnedCustomers,
    newCustomers: record.newCustomers,
  }));
}

export function buildForecastRows(labels: string[], trendArr: number[], scenarioArr: number[]): ChartRow[] {
  return labels.map((label, index) => ({ label, trend: trendArr[index], scenario: scenarioArr[index] }));
}
