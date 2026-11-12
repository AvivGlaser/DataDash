import { useState } from 'react';
import type { FormEvent } from 'react';
import type { DashboardMode, QuestionnaireProps } from '../../types';
import { parseDraft } from '../../utils/answers';
import { parseProfile } from '../../utils/businessProfile';
import { FLOW_TEXT } from '../../utils/questionnaireFlows';
import { useAnswerDraft } from '../../utils/useAnswerDraft';
import { useProfileDraft } from '../../utils/useProfileDraft';
import { Icon } from '../common/Icon';
import { AnswerFields } from './AnswerFields';
import { ProfileFields } from './ProfileFields';
import { TrendQuestions } from './TrendQuestions';

export function Questionnaire({ flow, initialAnswers, initialProfile, onClose, onComplete }: QuestionnaireProps) {
  const mode: DashboardMode = flow === 'instant' ? 'instant' : 'extended';
  const isUpgrade = flow === 'upgrade';
  const text = FLOW_TEXT[flow];
  const draftState = useAnswerDraft(initialAnswers, mode);
  const profileState = useProfileDraft(initialProfile);
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  // Upgrading skips the six core questions, so the extra ones are numbered from 1
  const extendedFirstNumber = isUpgrade ? 1 : 7;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasTriedSubmit(true);
    const answers = parseDraft(draftState.draft, draftState.choices, draftState.currency, mode);
    const profile = parseProfile({ businessName: profileState.businessName, category: profileState.category });
    if (answers && profile) onComplete(answers, profile, mode);
    // Takes the user to the first answer that still needs fixing, once its error is on screen
    else requestAnimationFrame(() => document.querySelector<HTMLElement>('.questionnaire [aria-invalid="true"]')?.focus());
  };

  return (
    <section className={`card questionnaire flow-${flow}`}>
      <header className="questionnaire-head">
        <div>
          <span className={`flow-badge mode-${mode}`}><Icon name={text.icon} size={14} />{text.badge}</span>
          <h1>{text.title}</h1>
          <p className="questionnaire-intro">{text.intro} Your answers stay in this browser.</p>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close questionnaire"><Icon name="close" /></button>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        {!isUpgrade && (
          <>
            <section className="question-group" aria-labelledby="group-business">
              <h2 id="group-business">About your business</h2>
              <ProfileFields profileState={profileState} showAllErrors={hasTriedSubmit} />
            </section>

            <section className="question-group" aria-labelledby="group-revenue">
              <h2 id="group-revenue">Revenue</h2>
              <p className="period-note"><Icon name="clock" size={15} /> <span>Every amount covers <strong>the past 12 months</strong>.</span></p>
              <TrendQuestions draftState={draftState} subject="revenue" firstNumber={3} showAllErrors={hasTriedSubmit} />
            </section>

            <section className="question-group" aria-labelledby="group-expenses">
              <h2 id="group-expenses">Expenses</h2>
              <TrendQuestions draftState={draftState} subject="expenses" firstNumber={5} showAllErrors={hasTriedSubmit} />
            </section>
          </>
        )}

        {mode === 'extended' && (
          <>
            <section className="question-group" aria-labelledby="group-customers">
              <h2 id="group-customers">Your customers</h2>
              <p className="period-note"><Icon name="clock" size={15} /> <span>Every answer in this part covers <strong>the past 12 months</strong>.</span></p>
              <AnswerFields draftState={draftState} group="customers" firstNumber={extendedFirstNumber} showAllErrors={hasTriedSubmit} />
            </section>

            <section className="question-group" aria-labelledby="group-per-sale">
              <h2 id="group-per-sale">Per sale</h2>
              <p className="group-note">For one product sold or one service delivered, on average. Skip these if a per-sale figure does not fit how your business earns.</p>
              <AnswerFields draftState={draftState} group="perSale" firstNumber={extendedFirstNumber + 4} showAllErrors={hasTriedSubmit} />
            </section>
          </>
        )}

        <div className="questionnaire-actions">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary">{text.submit}</button>
        </div>
      </form>
    </section>
  );
}
