import type { Currency } from '../types';

export const CURRENCY_SYMBOLS: Record<Currency, string> = { USD: '$', ILS: '₪' };

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

/** For small per-sale amounts, where cents matter: $3.20, but $40 rather than $40.00. */
export function formatUnitMoney(amount: number, currency: Currency): string {
  const hasCents = Math.round(amount * 100) % 100 !== 0;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: hasCents ? 2 : 0, maximumFractionDigits: 2 }).format(amount);
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

/** A change in percent with its sign, so a rise reads +12.5% and a fall -4.0%. */
export const formatSignedPercent = (percent: number) => (percent > 0 ? '+' : '') + formatPercent(percent);
