import type { BusinessCategoryId, BusinessMetrics, Currency, Insight, InsightBasis, PeriodChange } from '../types';
import { findCategory } from './businessProfile';
import { formatMoney, formatPercent, formatUnitMoney } from './format';
import { GOOD_RETENTION_PERCENT } from './statTiles';
import { getDirection } from './trendTiles';

const MAX_INSIGHTS = 3;
/** A widely used rule of thumb: many small businesses aim to keep at least 10 of every 100 earned */
const THIN_MARGIN_PERCENT = 10;
const HEALTHY_MARGIN_PERCENT = 20;

const FALLBACK_COSTS = 'your three biggest regular costs';
const FALLBACK_WIN_BACK = 'Contact your best past customers and ask what would bring them back.';

/** "rose 11.6%" when the change was worked out, "went up" when it is the user's own impression */
function describeChange(change: PeriodChange): string {
  const direction = getDirection(change);
  if (change.percent !== null) {
    if (direction === 'same') return 'stayed the same';
    return `${direction === 'up' ? 'rose' : 'fell'} ${formatPercent(Math.abs(change.percent))}`;
  }
  if (direction === 'up') return 'went up';
  return direction === 'down' ? 'went down' : 'stayed roughly the same';
}

/** The weakest source wins: one impression makes the whole conclusion an impression. */
function getTrendBasis(metrics: BusinessMetrics): InsightBasis {
  const changes = [metrics.revenueChange, metrics.expensesChange].filter((change) => getDirection(change) !== null);
  if (changes.some((change) => change.percent === null)) return 'assessment';
  return metrics.revenueIsEstimate || metrics.expensesIsEstimate ? 'estimate' : 'exact';
}

function buildProfitInsight(metrics: BusinessMetrics, currency: Currency, typicalCosts: string): Insight {
  const basis: InsightBasis = metrics.revenueIsEstimate || metrics.expensesIsEstimate ? 'estimate' : 'exact';
  const hundred = formatMoney(100, currency);
  const kept = `You keep ${formatUnitMoney(metrics.netProfitMargin, currency)} of every ${hundred} you earn.`;
  const ruleOfThumb = `Many small businesses aim to keep at least ${formatMoney(THIN_MARGIN_PERCENT, currency)}.`;
  const base = { id: 'profit', basis };

  if (metrics.netProfit < 0) {
    return {
      ...base, tone: 'negative', icon: 'alert', title: 'You are spending more than you earn',
      finding: `Expenses were ${formatMoney(-metrics.netProfit, currency)} more than revenue over the past 12 months.`,
      action: `Start with your biggest costs, such as ${typicalCosts}, and check that your prices still cover them.`,
    };
  }
  if (metrics.netProfit === 0) {
    return {
      ...base, tone: 'warning', icon: 'alert', title: 'You are breaking even',
      finding: 'Revenue and expenses were the same, so nothing was left as profit.',
      action: `A small price rise, or trimming ${typicalCosts}, would turn this into profit.`,
    };
  }
  if (metrics.netProfitMargin < THIN_MARGIN_PERCENT) {
    return {
      ...base, tone: 'warning', icon: 'percent', title: 'Your profit margin is thin',
      finding: `${kept} ${ruleOfThumb}`,
      action: `Small changes count here: a modest price rise, or trimming ${typicalCosts}, goes straight to profit.`,
    };
  }
  if (metrics.netProfitMargin >= HEALTHY_MARGIN_PERCENT) {
    return {
      ...base, tone: 'positive', icon: 'moneyBag', title: 'Your profit margin is healthy',
      finding: `${kept} That is well above what many small businesses keep.`,
      action: 'Consider putting part of this profit back into whatever brings in your best customers.',
    };
  }
  return {
    ...base, tone: 'neutral', icon: 'percent', title: 'Your profit margin is solid',
    finding: `${kept} ${ruleOfThumb}`,
    action: `To grow it, review ${typicalCosts} once a year and raise prices when your costs rise.`,
  };
}

function buildTrendInsight(metrics: BusinessMetrics, typicalCosts: string, winBackIdea: string): Insight | null {
  const revenue = getDirection(metrics.revenueChange);
  const expenses = getDirection(metrics.expensesChange);
  const basis = getTrendBasis(metrics);
  const revenueOnly = `Revenue ${describeChange(metrics.revenueChange)}.`;
  const expensesOnly = `Expenses ${describeChange(metrics.expensesChange)}.`;
  const both = `Revenue ${describeChange(metrics.revenueChange)} and expenses ${describeChange(metrics.expensesChange)}.`;
  const base = { id: 'trend', basis };

  if (revenue === null && expenses === null) {
    return {
      id: 'trend-missing', basis: null, tone: 'neutral', icon: 'help', title: 'See which way you are heading',
      finding: 'You were not sure how this year compared with the one before, so there is no trend yet.',
      action: 'If you can find last year\'s revenue and expenses, add them to see the change.',
    };
  }
  if (revenue === 'down' && expenses === 'up') {
    return { ...base, tone: 'negative', icon: 'trendDown', title: 'Revenue fell while costs rose', finding: `${both} That squeezes profit from both sides.`, action: `${winBackIdea} Then check what pushed costs up.` };
  }
  if (revenue === 'down') {
    return { ...base, tone: 'warning', icon: 'trendDown', title: 'Revenue went down', finding: expenses ? both : revenueOnly, action: winBackIdea };
  }
  const percents = [metrics.revenueChange.percent, metrics.expensesChange.percent];
  if (revenue === 'up' && expenses === 'up') {
    const [revenuePercent, expensesPercent] = percents;
    if (revenuePercent === null || expensesPercent === null) {
      return {
        ...base, tone: 'neutral', icon: 'trendUp', title: 'Revenue and costs both went up',
        finding: `${both} Without both earlier amounts, there is no way to tell which grew faster.`,
        action: 'If you can find last year\'s totals, add them to see whether profit kept pace.',
      };
    }
    if (expensesPercent > revenuePercent) {
      return { ...base, tone: 'warning', icon: 'receipt', title: 'Costs are growing faster than sales', finding: both, action: 'Find which costs grew the most, and check that they brought in more sales.' };
    }
    if (expensesPercent === revenuePercent) {
      return { ...base, tone: 'neutral', icon: 'trendUp', title: 'Sales and costs grew at the same pace', finding: both, action: 'Your margin held steady. To grow it, look for costs that do not need to rise with sales.' };
    }
  }
  if (revenue === 'up' && expenses === null) {
    return { ...base, tone: 'positive', icon: 'trendUp', title: 'Revenue went up', finding: revenueOnly, action: 'If you can find last year\'s expenses, add them to see whether costs kept pace.' };
  }
  if (revenue === 'up') {
    return { ...base, tone: 'positive', icon: 'trendUp', title: 'Sales are growing faster than costs', finding: expenses ? both : revenueOnly, action: 'This is how profit grows. Keep doing what brought in the extra sales, and watch costs as you grow.' };
  }
  if (expenses === 'up') {
    return { ...base, tone: 'warning', icon: 'receipt', title: 'Costs went up', finding: revenue ? both : expensesOnly, action: `Check what pushed costs up, starting with ${typicalCosts}.` };
  }
  if (expenses === 'down') {
    return { ...base, tone: 'positive', icon: 'check', title: 'You cut your costs', finding: revenue ? both : expensesOnly, action: 'Make sure the savings did not come from something your customers value.' };
  }
  return null;
}

function buildCustomerInsight(metrics: BusinessMetrics, winBackIdea: string): Insight | null {
  if (!metrics.hasCustomerData) return null;
  const stayed = `${formatPercent(metrics.retentionRate)} of your customers stayed.`;
  if (metrics.retentionRate < GOOD_RETENTION_PERCENT) {
    return {
      id: 'customers', basis: 'exact', tone: 'warning', icon: 'userMinus', title: 'More customers are leaving than is ideal',
      finding: `${stayed} Good is above ${GOOD_RETENTION_PERCENT}%.`,
      action: `${winBackIdea} Asking a few who left why they went is often the quickest lesson.`,
    };
  }
  if (metrics.retentionRate > GOOD_RETENTION_PERCENT) {
    return {
      id: 'customers', basis: 'exact', tone: 'positive', icon: 'userCheck', title: 'Customers keep coming back',
      finding: `${stayed} That is above the ${GOOD_RETENTION_PERCENT}% mark.`,
      action: 'Loyal customers are your best marketing. Ask them for reviews or referrals.',
    };
  }
  return null;
}

/**
 * A few plain-words conclusions, each drawn only from answers the user gave.
 * Each says where it comes from: calculated numbers, the user's estimates, or the user's own impression.
 */
export function buildInsights(metrics: BusinessMetrics, category: BusinessCategoryId | null, currency: Currency): Insight[] {
  const found = findCategory(category);
  const typicalCosts = found?.typicalCosts ?? FALLBACK_COSTS;
  const winBackIdea = found?.winBackIdea ?? FALLBACK_WIN_BACK;
  const insights = [
    buildProfitInsight(metrics, currency, typicalCosts),
    buildTrendInsight(metrics, typicalCosts, winBackIdea),
    buildCustomerInsight(metrics, winBackIdea),
  ];
  return insights.filter((insight): insight is Insight => insight !== null).slice(0, MAX_INSIGHTS);
}
