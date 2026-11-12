import type { BusinessMetrics, Currency, RevenueSplit, SplitSegment } from '../types';
import { formatMoney, formatPercent, formatUnitMoney } from './format';

/**
 * Splits the year into "what you spend" and "what you keep", per 100 of revenue.
 * With a loss, the bar becomes all expenses: the part revenue paid for, and the part it did not.
 */
export function buildRevenueSplit(metrics: BusinessMetrics, currency: Currency): RevenueSplit {
  const { revenue, expenses, netProfit } = metrics;
  const money = (amount: number) => formatMoney(amount, currency);
  const hundred = money(100);

  if (netProfit >= 0) {
    const expenseShare = (expenses / revenue) * 100;
    const profitShare = (netProfit / revenue) * 100;
    const segments: SplitSegment[] = [
      { id: 'expenses', label: 'Spent on expenses', amount: money(expenses), share: expenseShare, shareText: `${formatPercent(expenseShare)} of revenue`, color: 'var(--series-out)' },
      { id: 'profit', label: 'Kept as profit', amount: money(netProfit), share: profitShare, shareText: `${formatPercent(profitShare)} of revenue`, color: 'var(--good)' },
    ];
    const kept = formatUnitMoney(profitShare, currency);
    return {
      headline: { before: 'You keep', amount: kept, after: `of every ${hundred} you earn.` },
      segments,
      totalLabel: `${money(revenue)} revenue`,
      ariaLabel: `Of ${money(revenue)} revenue, ${money(expenses)} went to expenses and ${money(netProfit)} was kept as profit. You keep ${kept} of every ${hundred}.`,
    };
  }

  const coveredShare = (revenue / expenses) * 100;
  const lossShare = 100 - coveredShare;
  const spent = formatUnitMoney((expenses / revenue) * 100, currency);
  return {
    headline: { before: 'You spend', amount: spent, after: `for every ${hundred} you earn.` },
    segments: [
      { id: 'coveredByRevenue', label: 'Paid for by revenue', amount: money(revenue), share: coveredShare, shareText: `${formatPercent(coveredShare)} of expenses`, color: 'var(--series-out)' },
      { id: 'loss', label: 'Not covered: your loss', amount: money(-netProfit), share: lossShare, shareText: `${formatPercent(lossShare)} of expenses`, color: 'var(--bad)' },
    ],
    totalLabel: `${money(expenses)} expenses`,
    ariaLabel: `Expenses of ${money(expenses)} were more than revenue of ${money(revenue)}, a loss of ${money(-netProfit)}. You spend ${spent} for every ${hundred} you earn.`,
  };
}
