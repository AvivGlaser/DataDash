import type { BusinessMetrics, Currency, IconName, MetricCalculation, MetricTermKey, PeriodChange, TileTone, TrendSubject, TrendTileData } from '../types';
import { formatMoney } from './format';
import { METRIC_TERMS } from './metricTerms';

export type TrendDirection = 'up' | 'down' | 'same';

/** The direction of a change: from the percent when it is known, otherwise from the user's own answer. */
export function getDirection(change: PeriodChange): TrendDirection | null {
  if (change.percent !== null) {
    if (change.percent > 0) return 'up';
    return change.percent < 0 ? 'down' : 'same';
  }
  if (change.trend === 'increased') return 'up';
  if (change.trend === 'decreased') return 'down';
  return change.trend === 'same' ? 'same' : null;
}

const DIRECTION_ICONS: Record<TrendDirection, IconName> = { up: 'up', down: 'down', same: 'flat' };
const DIRECTION_WORDS: Record<TrendDirection, string> = { up: 'Went up', down: 'Went down', same: 'About the same' };

/** Rising revenue is good news. Rising expenses are not bad in themselves, so they get a caution tone, not red. */
const TONES: Record<TrendSubject, Record<TrendDirection, TileTone>> = {
  revenue: { up: 'positive', down: 'negative', same: 'neutral' },
  expenses: { up: 'warning', down: 'positive', same: 'neutral' },
};

export function buildTrendTiles(
  metrics: BusinessMetrics,
  calculations: Record<MetricTermKey, MetricCalculation>,
  currency: Currency,
): TrendTileData[] {
  const money = (amount: number) => formatMoney(amount, currency);
  const subjects: { id: TrendSubject; current: number; change: PeriodChange; isEstimate: boolean }[] = [
    { id: 'revenue', current: metrics.revenue, change: metrics.revenueChange, isEstimate: metrics.revenueIsEstimate },
    { id: 'expenses', current: metrics.expenses, change: metrics.expensesChange, isEstimate: metrics.expensesIsEstimate },
  ];

  return subjects.map(({ id, current, change, isEstimate }) => {
    const key = id === 'revenue' ? 'revenueChange' : 'expensesChange';
    const direction = getDirection(change);
    const base = { id, metric: METRIC_TERMS[key], calculation: calculations[key] };

    if (direction === null) {
      return {
        ...base, tone: 'neutral', icon: 'help', percent: null, valueText: 'Not known yet', basis: null,
        detail: `If you find the ${id} for the 12 months before, add it to see the change.`,
      };
    }
    if (change.percent !== null && change.previous !== null) {
      return {
        ...base, tone: TONES[id][direction], icon: DIRECTION_ICONS[direction], percent: change.percent, valueText: '',
        basis: isEstimate ? 'estimate' : 'exact',
        detail: `From ${money(change.previous)} to ${money(current)}.`,
      };
    }
    return {
      ...base, tone: TONES[id][direction], icon: DIRECTION_ICONS[direction], percent: null, valueText: DIRECTION_WORDS[direction],
      basis: 'assessment',
      detail: 'Based on your answer. Add the earlier amount to see the exact change.',
    };
  });
}
