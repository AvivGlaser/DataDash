import type { ExchangeRateNoteProps } from '../../types';
import { describeRate } from '../../utils/currency';
import { Icon } from '../common/Icon';

export function ExchangeRateNote({ enteredCurrency, currency, rate, isConversionUnavailable }: ExchangeRateNoteProps) {
  if (isConversionUnavailable) {
    return <span className="rate-note"><Icon name="alert" size={14} /> The exchange rate is unavailable, so amounts are shown in {enteredCurrency}.</span>;
  }
  if (!rate || enteredCurrency === currency) return null;
  return <span className="rate-note">Converted from {enteredCurrency} at {describeRate(rate)}</span>;
}
