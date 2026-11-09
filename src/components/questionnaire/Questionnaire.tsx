import { useState } from 'react';
import type { FormEvent } from 'react';
import type { QuestionnaireProps } from '../../types';
import { parseDraft } from '../../utils/answers';
import { useAnswerDraft } from '../../utils/useAnswerDraft';
import { Icon } from '../common/Icon';
import { AnswerFields } from './AnswerFields';

export function Questionnaire({ initialAnswers, onClose, onComplete }: QuestionnaireProps) {
  const draftState = useAnswerDraft(initialAnswers);
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasTriedSubmit(true);
    const answers = parseDraft(draftState.draft, draftState.currency);
    if (answers) onComplete(answers);
  };

  return (
    <section className="card questionnaire">
      <header className="questionnaire-head">
        <div>
          <h1>Tell us about your business</h1>
          <p className="period-note"><Icon name="clock" size={15} /> <span>Every answer should cover <strong>the past 12 months</strong>.</span></p>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close questionnaire"><Icon name="close" /></button>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        <AnswerFields draftState={draftState} showAllErrors={hasTriedSubmit} />
        <div className="questionnaire-actions">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary">Build my dashboard</button>
        </div>
      </form>
    </section>
  );
}
