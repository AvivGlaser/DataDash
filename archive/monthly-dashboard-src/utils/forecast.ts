import type { ForecastBaseline, ForecastResult, MetricSummary, MonthRecord } from '../types';
import { addMonths, formatMonthLabel } from './format';
import { getArr } from './metrics';

export const FORECAST_MONTHS = 12;

/** Returns null when the summary lacks what a projection needs, rather than assuming a value. */
export function getForecastBaseline(summary: MetricSummary): ForecastBaseline | null {
  if (summary.churnRate === null || summary.arpa === null) return null;
  return {
    churnPercent: summary.churnRate * 100,
    newCustomersPerMonth: summary.newCustomers / summary.monthCount,
    arpa: summary.arpa,
  };
}

/** Projects ARR month by month. The first value is today's actual ARR. */
export function projectArr(lastRecord: MonthRecord, assumptions: ForecastBaseline): ForecastResult {
  const arrByMonth = [getArr(lastRecord)];
  let customers = lastRecord.customers;
  for (let month = 0; month < FORECAST_MONTHS; month++) {
    customers = customers * (1 - assumptions.churnPercent / 100) + assumptions.newCustomersPerMonth;
    arrByMonth.push(customers * assumptions.arpa * 12);
  }
  return { arrByMonth };
}

export function buildForecastLabels(lastMonth: string): string[] {
  return Array.from({ length: FORECAST_MONTHS + 1 }, (_unused, offset) => formatMonthLabel(addMonths(lastMonth, offset)));
}
