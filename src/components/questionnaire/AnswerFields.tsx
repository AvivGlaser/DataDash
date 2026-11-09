import { useState } from 'react';
import type { AnswerFieldsProps, AnswerKey } from '../../types';
import { ANSWER_FIELDS } from '../../utils/answers';
import { CURRENCY_SYMBOLS } from '../../utils/format';
import { CurrencyToggle } from '../common/CurrencyToggle';
import { Icon } from '../common/Icon';

export function AnswerFields({ draftState, showAllErrors }: AnswerFieldsProps) {
  const { draft, currency, errors, updateField, updateCurrency } = draftState;
  const [visitedFields, setVisitedFields] = useState<AnswerKey[]>([]);

  return (
    <div className="answer-fields">
      {ANSWER_FIELDS.map((field, fieldIndex) => {
        const error = showAllErrors || visitedFields.includes(field.key) ? errors[field.key] : undefined;
        const isRevenue = field.key === 'revenue';
        return (
          <div className="answer-field" key={field.key}>
            <label htmlFor={`answer-${field.key}`}>{fieldIndex + 1}. {field.question}</label>
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
                  onBlur={() => setVisitedFields([...visitedFields, field.key])}
                />
              </div>
              {isRevenue && <CurrencyToggle value={currency} onChange={updateCurrency} ariaLabel="Currency of your answers" />}
            </div>
            {field.key === 'expenses' && <small>In {currency}, the same currency as your revenue.</small>}
            {field.hint && <small>{field.hint}</small>}
            {field.minimum > 0 && <small>Minimum {field.minimum.toLocaleString('en-US')}.</small>}
            {error && <p className="form-error" role="alert"><Icon name="alert" size={14} /> {error}</p>}
          </div>
        );
      })}
    </div>
  );
}
