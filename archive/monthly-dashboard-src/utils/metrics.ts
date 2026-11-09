import type { ChangeInfo, ChangeMode, ComparisonWindows, MetricSummary, MonthRecord } from '../types';
import { addMonths, monthToIndex } from './format';

/** Division that returns null instead of dividing by zero. */
const divideIfPositive = (numerator: number, denominator: number) =>
  denominator > 0 ? numerator / denominator : null;

/** Zero spend is not a real acquisition cost, so CAC needs both spend and new customers. */
const calculateCac = (salesMarketing: number, newCustomers: number) =>
  salesMarketing > 0 ? divideIfPositive(salesMarketing, newCustomers) : null;

/** Customers at the start of the month, worked out from the month's movement. */
export const getStartingCustomers = (record: MonthRecord) =>
  record.customers - record.newCustomers + record.churnedCustomers;

export const getArr = (record: MonthRecord) => record.mrr * 12;
export const getChurnRate = (record: MonthRecord) => divideIfPositive(record.churnedCustomers, getStartingCustomers(record));
export const getRoi = (record: MonthRecord) => divideIfPositive(record.revenue - record.totalCosts, record.totalCosts);
export const getArpa = (record: MonthRecord) => divideIfPositive(record.mrr, record.customers);
export const getCac = (record: MonthRecord) => calculateCac(record.salesMarketing, record.newCustomers);
export const getLtvCac = (record: MonthRecord) => summarizeMonths([record])?.ltvCac ?? null;
export const getPaybackMonths = (record: MonthRecord) => summarizeMonths([record])?.paybackMonths ?? null;
export const getNetMargin = (record: MonthRecord) => divideIfPositive(record.revenue - record.totalCosts, record.revenue);
export const getGrossMargin = (record: MonthRecord) => divideIfPositive(record.revenue - record.cogs, record.revenue);

export function getChurnPercent(record: MonthRecord): number | null {
  const churnRate = getChurnRate(record);
  return churnRate === null ? null : churnRate * 100;
}

const sumRecords = (records: MonthRecord[], getValue: (record: MonthRecord) => number) =>
  records.reduce((total, record) => total + getValue(record), 0);

/** Every formula here is described in words in metricTerms.ts. Keep the two in step. */
export function summarizeMonths(records: MonthRecord[]): MetricSummary | null {
  if (!records.length) return null;
  const lastRecord = records[records.length - 1];

  const revenue = sumRecords(records, (record) => record.revenue);
  const costs = sumRecords(records, (record) => record.totalCosts);
  const cogs = sumRecords(records, (record) => record.cogs);
  const salesMarketing = sumRecords(records, (record) => record.salesMarketing);
  const churned = sumRecords(records, (record) => record.churnedCustomers);
  const newCustomers = sumRecords(records, (record) => record.newCustomers);
  const startingCustomers = sumRecords(records, getStartingCustomers);
  const profit = revenue - costs;

  const churnRate = divideIfPositive(churned, startingCustomers);
  const arpa = getArpa(lastRecord);
  const cac = calculateCac(salesMarketing, newCustomers);
  const grossMargin = divideIfPositive(revenue - cogs, revenue);
  const grossProfitPerAccount = arpa !== null && grossMargin !== null ? arpa * grossMargin : null;
  const ltv = grossProfitPerAccount !== null && churnRate ? grossProfitPerAccount / churnRate : null;

  return {
    monthCount: records.length,
    arr: getArr(lastRecord),
    mrr: lastRecord.mrr,
    customers: lastRecord.customers,
    revenue,
    costs,
    cogs,
    salesMarketing,
    startingCustomers,
    profit,
    roi: divideIfPositive(profit, costs),
    netMargin: divideIfPositive(profit, revenue),
    grossMargin,
    churnRate,
    churned,
    newCustomers,
    arpa,
    cac,
    ltv,
    ltvCac: ltv !== null && cac ? ltv / cac : null,
    paybackMonths: cac !== null && grossProfitPerAccount && grossProfitPerAccount > 0 ? cac / grossProfitPerAccount : null,
  };
}

/** Splits records into the selected trailing period and the equal-length period before it. */
export function getComparisonWindows(records: MonthRecord[], windowSize: number): ComparisonWindows {
  if (!records.length || windowSize === 0) return { current: records, prior: null };
  const windowStart = addMonths(records[records.length - 1].month, -(windowSize - 1));
  const priorStart = addMonths(windowStart, -windowSize);
  const prior = records.filter((record) => record.month >= priorStart && record.month < windowStart);
  return {
    current: records.filter((record) => record.month >= windowStart),
    prior: prior.length === windowSize ? prior : null,
  };
}

/** Compares a metric with the previous period and says whether the movement is good news. */
export function calculateChange(
  currentValue: number | null,
  previousValue: number | null | undefined,
  isHigherBetter: boolean,
  mode: ChangeMode,
): ChangeInfo | null {
  if (currentValue === null || previousValue === null || previousValue === undefined) return null;
  if (mode === 'relative' && previousValue === 0) return null;

  const difference = mode === 'relative'
    ? (currentValue - previousValue) / Math.abs(previousValue)
    : currentValue - previousValue;
  const isFlat = Math.abs(difference) < 0.0005;
  const isIncrease = difference > 0;
  const displayValue = (Math.abs(difference) * 100).toFixed(1);

  return {
    text: mode === 'relative' ? `${displayValue}%` : `${displayValue} pts`,
    direction: isFlat ? 'flat' : isIncrease ? 'up' : 'down',
    isGood: isFlat ? null : isIncrease === isHigherBetter,
  };
}

/** Months absent between the first and last record. */
export function findMissingMonths(records: MonthRecord[]): string[] {
  const missingMonths: string[] = [];
  for (let index = 1; index < records.length; index++) {
    const previousMonth = records[index - 1].month;
    const gap = monthToIndex(records[index].month) - monthToIndex(previousMonth);
    for (let offset = 1; offset < gap; offset++) missingMonths.push(addMonths(previousMonth, offset));
  }
  return missingMonths;
}

/** True when a record's customer numbers cannot all be right. Shown as a warning, never blocked. */
export const hasInconsistentCustomers = (record: MonthRecord) =>
  getStartingCustomers(record) < record.churnedCustomers || record.newCustomers > record.customers;
