import type { AnswersCardProps } from '../../types';
import { useAnswerDraft } from '../../utils/useAnswerDraft';
import { AnswerFields } from '../questionnaire/AnswerFields';

export function AnswersCard({ answers, onChange, onClear }: AnswersCardProps) {
  const draftState = useAnswerDraft(answers, onChange);

  return (
    <section className="card span-12">
      <header className="card-head">
        <div>
          <h2>Your answers</h2>
          <p>Past 12 months. The dashboard updates as you type, and keeps the last valid numbers until every answer is valid.</p>
        </div>
        <button className="btn ghost small danger" onClick={onClear}>Clear my answers</button>
      </header>
      <AnswerFields draftState={draftState} showAllErrors />
    </section>
  );
}
