const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const NO_VALUE = '-';

export function monthToIndex(month: string): number {
  const [year, monthNumber] = month.split('-').map(Number);
  return year * 12 + monthNumber - 1;
}

export function addMonths(month: string, monthsToAdd: number): string {
  const targetIndex = monthToIndex(month) + monthsToAdd;
  const year = Math.floor(targetIndex / 12);
  const monthNumber = String((targetIndex % 12) + 1).padStart(2, '0');
  return `${year}-${monthNumber}`;
}

export function getCurrentMonth(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
}

export function formatMonthLabel(month: string): string {
  const [year, monthNumber] = month.split('-');
  return `${MONTH_NAMES[Number(monthNumber) - 1]} ${year.slice(2)}`;
}

function toCompactNumber(amount: number): string {
  const size = Math.abs(amount);
  const trimDecimals = (value: number, decimals: number) => value.toFixed(decimals).replace(/\.0+$/, '');
  if (size >= 1e9) return `${trimDecimals(amount / 1e9, 2)}B`;
  if (size >= 1e6) return `${trimDecimals(amount / 1e6, size >= 1e8 ? 0 : 1)}M`;
  if (size >= 1e4) return `${trimDecimals(amount / 1e3, size >= 1e5 ? 0 : 1)}K`;
  return Math.round(amount).toLocaleString('en-US');
}

export function formatMoney(amount: number | null): string {
  if (amount === null) return NO_VALUE;
  return `${amount < 0 ? '-' : ''}$${toCompactNumber(Math.abs(amount))}`;
}

export const formatCompactCount = (amount: number | null) => (amount === null ? NO_VALUE : toCompactNumber(amount));

export const formatWholeNumber = (amount: number | null) =>
  amount === null ? NO_VALUE : Math.round(amount).toLocaleString('en-US');

export const formatPercent = (fraction: number | null, decimals = 1) =>
  fraction === null ? NO_VALUE : `${(fraction * 100).toFixed(decimals)}%`;

export const formatPercentTwoDecimals = (fraction: number | null) => formatPercent(fraction, 2);

export const formatRatio = (ratio: number | null) => (ratio === null ? NO_VALUE : `${ratio.toFixed(1)}x`);

export const formatMonthCount = (months: number | null) => (months === null ? NO_VALUE : `${months.toFixed(1)} mo`);

/** For values already expressed as a percentage, such as 2.5 for 2.5%. */
export const formatPercentValue = (percent: number) => `${percent.toFixed(1)}%`;

export const formatPercentTick = (percent: number) => `${Number(percent.toFixed(1))}%`;

export const formatSignedMoney = (amount: number) => `${amount >= 0 ? '+' : ''}${formatMoney(amount)}`;
