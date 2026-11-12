import type { TrendQuestionsProps } from '../../types';
import { findField, getTrendOptions, TREND_KEYS } from '../../utils/answers';
import { useVisitedFields } from '../../utils/useVisitedFields';
import { FormError } from '../common/FormError';
import { AnswerField } from './AnswerField';

/**
 * Two questions about one amount: how much it was this year, and how it compares with the year before.
 * The earlier amount is asked only when the user knows it, so nobody has to dig through old records.
 */
export function TrendQuestions({ draftState, subject, firstNumber, showAllErrors }: TrendQuestionsProps) {
  const keys = TREND_KEYS[subject];
  const { choices, errors, updateTrend, updateEstimate } = draftState;
  const trend = choices[keys.trend];
  const trendError = showAllErrors ? errors[keys.trend] : undefined;
  const { isShown, visit } = useVisitedFields(showAllErrors);

  return (
    <div className="answer-fields">
      <div className="trend-amount">
        <AnswerField
          field={findField(keys.amount)}
          number={firstNumber}
          draftState={draftState}
          showError={isShown(keys.amount)}
          onVisit={() => visit(keys.amount)}
        />
        <label className="estimate-check">
          <input type="checkbox" checked={choices[keys.estimate]} onChange={(event) => updateEstimate(subject, event.target.checked)} />
          <span>This is a rough estimate</span>
        </label>
      </div>

      <fieldset className="answer-field trend-question">
        <legend>{firstNumber + 1}. How {subject === 'revenue' ? 'does' : 'do'} your {subject} compare to the 12 months before?</legend>
        <div className="choice-grid">
          {getTrendOptions(subject).map((option) => (
            <label key={option.id} className={`choice choice-${option.id}`}>
              <input
                type="radio"
                name={`${subject}-trend`}
                value={option.id}
                checked={trend === option.id}
                aria-invalid={!!trendError}
                onChange={() => updateTrend(subject, option.id)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        <FormError message={trendError} />
        {trend === 'exact' && (
          <AnswerField
            field={findField(keys.previous)}
            number={null}
            draftState={draftState}
            showError={isShown(keys.previous)}
            onVisit={() => visit(keys.previous)}
          />
        )}
        {trend && trend !== 'exact' && (
          <small className="trend-note">
            {trend === 'unsure'
              ? 'No problem. The dashboard will skip the trend until you add it.'
              : 'Got it. The dashboard will show the direction, without inventing a percentage.'}
          </small>
        )}
      </fieldset>
    </div>
  );
}
