import type { AnswersCardProps } from '../../types';
import { useAnswerDraft } from '../../utils/useAnswerDraft';
import { useProfileDraft } from '../../utils/useProfileDraft';
import { AnswerFields } from '../questionnaire/AnswerFields';
import { ProfileFields } from '../questionnaire/ProfileFields';
import { TrendQuestions } from '../questionnaire/TrendQuestions';

export function AnswersCard({ answers, mode, profile, onChange, onProfileChange, onClear }: AnswersCardProps) {
  const draftState = useAnswerDraft(answers, mode, onChange);
  const profileState = useProfileDraft(profile, onProfileChange);

  return (
    <section className="card span-12 answers-card">
      <header className="card-head">
        <div>
          <h2>Your answers</h2>
          <p>The dashboard updates as you type, and keeps the last valid answers until every answer is valid.</p>
        </div>
        <button className="btn ghost small danger" onClick={onClear}>Clear my answers</button>
      </header>
      <h3 className="answers-group-title">Business details</h3>
      <ProfileFields profileState={profileState} showAllErrors />
      <div className="answers-trend-grid">
        <div>
          <h3 className="answers-group-title">Revenue</h3>
          <TrendQuestions draftState={draftState} subject="revenue" firstNumber={3} showAllErrors />
        </div>
        <div>
          <h3 className="answers-group-title">Expenses</h3>
          <TrendQuestions draftState={draftState} subject="expenses" firstNumber={5} showAllErrors />
        </div>
      </div>
      {mode === 'extended' && (
        <>
          <h3 className="answers-group-title">Customers</h3>
          <AnswerFields draftState={draftState} group="customers" firstNumber={7} showAllErrors />
          <h3 className="answers-group-title">Per sale</h3>
          <AnswerFields draftState={draftState} group="perSale" firstNumber={11} showAllErrors />
        </>
      )}
    </section>
  );
}
