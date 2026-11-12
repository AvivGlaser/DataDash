import type { AnswerFieldProps } from '../../types';
import { CURRENCY_SYMBOLS } from '../../utils/format';
import { CurrencyToggle } from '../common/CurrencyToggle';
import { FormError } from '../common/FormError';

/** One number question. Revenue also holds the currency choice, which every money answer follows. */
export function AnswerField({ field, number, draftState, showError, onVisit }: AnswerFieldProps) {
  const { draft, currency, errors, updateField, updateCurrency } = draftState;
  const error = showError ? errors[field.key] : undefined;
  const isRevenue = field.key === 'revenue';

  return (
    <div className={`answer-field${number === null ? ' follow-up' : ''}`}>
      <label htmlFor={`answer-${field.key}`}>
        {number !== null && `${number}. `}{field.question}
        {field.isOptional && <span className="optional-tag">Optional</span>}
      </label>
      <div className="answer-input-row">
        <div className="answer-input">
          {field.unit === 'money' && <span aria-hidden="true">{CURRENCY_SYMBOLS[currency]}</span>}
          <input
            id={`answer-${field.key}`}
            inputMode={field.unit === 'money' ? 'decimal' : 'numeric'}
            maxLength={18}
            aria-invalid={!!error}
            value={draft[field.key]}
            onChange={(event) => updateField(field.key, event.target.value)}
            onBlur={onVisit}
          />
        </div>
        {isRevenue && <CurrencyToggle value={currency} onChange={updateCurrency} ariaLabel="Currency of your answers" />}
      </div>
      {field.unit === 'money' && !isRevenue && <small>In {currency}, the same currency as your revenue.</small>}
      {field.hint && <small>{field.hint}</small>}
      {field.minimum > 1 && <small>Minimum {field.minimum.toLocaleString('en-US')}.</small>}
      <FormError message={error} />
    </div>
  );
}
