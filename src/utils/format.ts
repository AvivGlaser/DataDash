import type { Currency } from '../types';

export const CURRENCY_SYMBOLS: Record<Currency, string> = { USD: '$', ILS: '₪' };

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatCompactMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, notation: 'compact', maximumFractionDigits: 1 }).format(amount);
}

export const formatWholeNumber = (amount: number) => Math.round(amount).toLocaleString('en-US');

const MAX_PERCENT_DECIMALS = 6;

/** True when rounding has turned a value into exactly 0% or 100% that it is not. */
const isMisleadingRounding = (percent: number, rounded: number) =>
  rounded !== percent && (rounded === 0 || Math.abs(rounded) === 100);

/**
 * For values already expressed as a percentage, such as 2.5 for 2.5%.
 * Normally one decimal, with more only when needed: 99.9997% must not read as 100.0%.
 */
export function formatPercent(percent: number): string {
  for (let decimals = 1; decimals <= MAX_PERCENT_DECIMALS; decimals++) {
    const text = percent.toFixed(decimals);
    if (!isMisleadingRounding(percent, Number(text))) return `${text}%`;
  }
  return `~${percent.toFixed(MAX_PERCENT_DECIMALS)}%`;
}
