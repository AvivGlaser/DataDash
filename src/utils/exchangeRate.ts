import type { ExchangeRate } from '../types';

const RATE_URL = 'https://api.frankfurter.dev/v1/latest?base=USD&symbols=ILS';
const RATE_STORAGE_KEY = 'datadash.exchangeRate';

const getToday = () => new Date().toLocaleDateString('en-CA');

let pendingRequest: Promise<ExchangeRate | null> | null = null;

export function readCachedExchangeRate(): ExchangeRate | null {
  try {
    const cached = JSON.parse(localStorage.getItem(RATE_STORAGE_KEY) ?? 'null');
    return cached && cached.usdToIls > 0 && cached.rateDate && cached.fetchedOn ? cached : null;
  } catch {
    return null;
  }
}

async function downloadExchangeRate(): Promise<ExchangeRate> {
  const response = await fetch(RATE_URL);
  if (!response.ok) throw new Error(`Exchange rate request failed: ${response.status}`);
  const data = await response.json();
  const usdToIls = Number(data.rates?.ILS);
  if (!(usdToIls > 0)) throw new Error('Exchange rate response had no ILS rate');

  const rate: ExchangeRate = { usdToIls, rateDate: data.date, fetchedOn: getToday() };
  try {
    localStorage.setItem(RATE_STORAGE_KEY, JSON.stringify(rate));
  } catch {
    /* Storage unavailable: the rate still works for this session. */
  }
  return rate;
}

/** Downloads at most once a day. If that fails, the last known rate is used and shows its own date. */
export function getDailyExchangeRate(): Promise<ExchangeRate | null> {
  const cached = readCachedExchangeRate();
  if (cached?.fetchedOn === getToday()) return Promise.resolve(cached);
  pendingRequest ??= downloadExchangeRate().catch(() => cached);
  return pendingRequest;
}
