import { useEffect, useState } from 'react';
import type { ExchangeRate } from '../types';
import { getDailyExchangeRate, readCachedExchangeRate } from './exchangeRate';

export function useExchangeRate(): ExchangeRate | null {
  const [rate, setRate] = useState<ExchangeRate | null>(readCachedExchangeRate);

  useEffect(() => {
    let isCurrent = true;
    getDailyExchangeRate().then((latestRate) => {
      if (isCurrent) setRate(latestRate);
    });
    return () => { isCurrent = false; };
  }, []);

  return rate;
}
