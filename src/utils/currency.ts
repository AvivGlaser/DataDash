import type { Currency, ExchangeRate } from '../types';

/** The single place money changes currency, so every part of the dashboard agrees. */
export function convertAmount(amount: number, from: Currency, to: Currency, rate: ExchangeRate | null): number {
  if (from === to || !rate) return amount;
  return from === 'USD' ? amount * rate.usdToIls : amount / rate.usdToIls;
}

/** Amounts can only be shown in another currency when a rate is available. */
export const getShownCurrency = (entered: Currency, requested: Currency, rate: ExchangeRate | null): Currency =>
  (rate ? requested : entered);

export const describeRate = (rate: ExchangeRate) =>
  `1 USD = ${rate.usdToIls.toFixed(3)} ILS (European Central Bank rate from ${rate.rateDate})`;
