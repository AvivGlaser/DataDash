import type { IconName, MetricSummary, TargetDraft, TargetEvaluation, TargetItem, Targets, TargetStatus } from '../types';
import { formatMoney, formatPercent, formatRatio, formatWholeNumber } from './format';
import { parseNumber } from './parsing';

const CLOSE_TO_TARGET = 0.8;

export const EMPTY_TARGETS: Targets = { arr: null, roi: null, churn: null, ltvCac: null, customers: null };

export const TARGET_STATUS_LABELS: Record<TargetStatus, string> = {
  none: 'No data',
  unset: 'Not set',
  good: 'On target',
  warn: 'Close',
  bad: 'Behind',
};

export const TARGET_STATUS_ICONS: Record<TargetStatus, IconName> = {
  none: 'alert',
  unset: 'flat',
  good: 'check',
  warn: 'clock',
  bad: 'alert',
};

export function buildTargetItems(summary: MetricSummary): TargetItem[] {
  return [
    { key: 'arr', metricKey: 'arr', label: 'ARR', note: 'Annual Recurring Revenue', value: summary.arr, format: formatMoney, isLowerBetter: false, inputScale: 1, unit: '$' },
    { key: 'customers', metricKey: 'activeCustomers', label: 'Active customers', note: 'Customers at the end of the period', value: summary.customers, format: formatWholeNumber, isLowerBetter: false, inputScale: 1, unit: '' },
    { key: 'roi', metricKey: 'roi', label: 'ROI', note: 'Return on Investment', value: summary.roi, format: formatPercent, isLowerBetter: false, inputScale: 100, unit: '%' },
    { key: 'churn', metricKey: 'churnRate', label: 'Monthly churn', note: 'Share of customers leaving each month', value: summary.churnRate, format: formatPercent, isLowerBetter: true, inputScale: 100, unit: '%' },
    { key: 'ltvCac', metricKey: 'ltvCac', label: 'LTV : CAC', note: 'Customer lifetime value compared with acquisition cost', value: summary.ltvCac, format: formatRatio, isLowerBetter: false, inputScale: 1, unit: 'x' },
  ];
}

function getTargetRatio(item: TargetItem, targetValue: number): number {
  if (item.value === null) return 0;
  if (item.isLowerBetter) return item.value === 0 ? 1 : targetValue / item.value;
  return item.value <= 0 ? 0 : item.value / targetValue;
}

export function evaluateTarget(item: TargetItem, targetValue: number | null): TargetEvaluation {
  if (targetValue === null) return { progress: 0, status: 'unset' };
  if (item.value === null) return { progress: 0, status: 'none' };
  const ratio = getTargetRatio(item, targetValue);
  const status: TargetStatus = ratio >= 1 ? 'good' : ratio >= CLOSE_TO_TARGET ? 'warn' : 'bad';
  return { progress: Math.min(1, ratio), status };
}

export function createTargetDraft(items: TargetItem[], targets: Targets): TargetDraft {
  const entries = items.map((item) => {
    const target = targets[item.key];
    return [item.key, target === null ? '' : String(Number((target * item.inputScale).toFixed(4)))];
  });
  return Object.fromEntries(entries) as TargetDraft;
}

/** Applies typed targets. Blank clears a target, and invalid entries keep their previous value. */
export function applyTargetDraft(items: TargetItem[], targets: Targets, draft: TargetDraft): Targets {
  const updatedTargets = { ...targets };
  items.forEach((item) => {
    if (!draft[item.key].trim()) {
      updatedTargets[item.key] = null;
      return;
    }
    const typedValue = parseNumber(draft[item.key]);
    if (typedValue !== null && typedValue > 0) updatedTargets[item.key] = typedValue / item.inputScale;
  });
  return updatedTargets;
}
