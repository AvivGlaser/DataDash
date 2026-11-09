import type { MonthRecord, TableData } from '../types';
import { formatMoney, formatMonthLabel, formatPercent, formatPercentTwoDecimals } from './format';
import { getChurnRate, getRoi } from './metrics';

/** The table twin of each chart, for reading exact values. */
export function buildRevenueTable(records: MonthRecord[]): TableData {
  return {
    headers: ['Month', 'Revenue', 'Total costs', 'ROI'],
    rows: records.map((record) => [
      formatMonthLabel(record.month), formatMoney(record.revenue), formatMoney(record.totalCosts), formatPercent(getRoi(record)),
    ]),
  };
}

export function buildChurnTable(records: MonthRecord[]): TableData {
  return {
    headers: ['Month', 'Churn rate', 'Customers lost'],
    rows: records.map((record) => [
      formatMonthLabel(record.month), formatPercentTwoDecimals(getChurnRate(record)), record.churnedCustomers,
    ]),
  };
}

export function buildCustomerMovementTable(records: MonthRecord[]): TableData {
  return {
    headers: ['Month', 'New', 'Churned', 'Net'],
    rows: records.map((record) => [
      formatMonthLabel(record.month), record.newCustomers, record.churnedCustomers, record.newCustomers - record.churnedCustomers,
    ]),
  };
}

export function buildForecastTable(labels: string[], trendArr: number[], scenarioArr: number[]): TableData {
  return {
    headers: ['Month', 'Current trend', 'Your scenario'],
    rows: labels.map((label, index) => [label, formatMoney(trendArr[index]), formatMoney(scenarioArr[index])]),
  };
}
