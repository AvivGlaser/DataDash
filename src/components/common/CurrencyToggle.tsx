import type { Currency, CurrencyToggleProps } from '../../types';
import { CURRENCY_SYMBOLS } from '../../utils/format';

const CURRENCIES: Currency[] = ['USD', 'ILS'];

export function CurrencyToggle({ value, onChange, ariaLabel, onlyCurrency }: CurrencyToggleProps) {
  return (
    <div className="segmented" role="group" aria-label={ariaLabel}>
      {CURRENCIES.map((currency) => (
        <button
          type="button"
          key={currency}
          aria-pressed={value === currency}
          disabled={onlyCurrency !== undefined && onlyCurrency !== currency}
          onClick={() => onChange(currency)}
        >
          {currency} ({CURRENCY_SYMBOLS[currency]})
        </button>
      ))}
    </div>
  );
}
