import type { GuidedAnswerProps } from '../../types';
import { getCurrentMonth } from '../../utils/format';
import { BUSINESS_MODEL_OPTIONS, buildReviewRows } from '../../utils/guidedQuestions';

/** Renders the answer control that matches the current question's kind. */
export function GuidedAnswer({ flow }: GuidedAnswerProps) {
  const { question, context } = flow;
  const { answers } = context;

  if (question.kind === 'choice') {
    return (
      <div className="guide-options">
        {BUSINESS_MODEL_OPTIONS.map((option) => (
          <button type="button" key={option.value} className="guide-option" aria-pressed={answers.businessModel === option.value} onClick={() => flow.chooseBusinessModel(option.value)}>
            <strong>{option.label}</strong>
            <span>{option.description}</span>
          </button>
        ))}
      </div>
    );
  }

  if (question.kind === 'month') {
    return (
      <input key={question.id} className="guide-input" type="month" aria-label="Month" max={getCurrentMonth()} value={answers.month} onChange={(event) => flow.updateMonth(event.target.value)} autoFocus />
    );
  }

  if (question.kind === 'number' && question.answerKey) {
    const { answerKey } = question;
    const quickFill = question.getQuickFill?.(context);
    return (
      <>
        <div className="guide-number">
          {question.unit === 'money' && <span aria-hidden="true">$</span>}
          <input
            key={question.id}
            className="guide-input"
            inputMode="decimal"
            aria-label={question.getPrompt(context)}
            placeholder={question.unit === 'money' ? 'For example 12,500 or 12.5K' : 'Number of customers'}
            value={answers[answerKey]}
            onChange={(event) => flow.updateNumber(answerKey, event.target.value)}
            autoFocus
          />
        </div>
        {quickFill && <button type="button" className="btn ghost small" onClick={() => flow.applyQuickFill(answerKey, quickFill.value)}>{quickFill.label}</button>}
      </>
    );
  }

  if (question.kind === 'review') {
    return (
      <dl className="guide-review">
        {buildReviewRows(context).map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>
              {row.value}
              {row.questionId && <button type="button" className="link" aria-label={`Edit ${row.label}`} onClick={() => flow.editFromReview(row.questionId!)}>Edit</button>}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return null;
}
