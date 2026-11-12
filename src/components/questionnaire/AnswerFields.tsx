import type { AnswerFieldsProps, AnswerKey } from '../../types';
import { ANSWER_FIELDS } from '../../utils/answers';
import { useVisitedFields } from '../../utils/useVisitedFields';
import { AnswerField } from './AnswerField';

export function AnswerFields({ draftState, group, firstNumber, showAllErrors }: AnswerFieldsProps) {
  const { isShown, visit } = useVisitedFields<AnswerKey>(showAllErrors);
  const fields = ANSWER_FIELDS.filter((field) => field.group === group);

  return (
    <div className="answer-fields">
      {fields.map((field, fieldIndex) => (
        <AnswerField
          key={field.key}
          field={field}
          number={firstNumber + fieldIndex}
          draftState={draftState}
          showError={isShown(field.key)}
          onVisit={() => visit(field.key)}
        />
      ))}
    </div>
  );
}
