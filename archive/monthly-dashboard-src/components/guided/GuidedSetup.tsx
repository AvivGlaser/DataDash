import type { FormEvent } from 'react';
import type { GuidedSetupProps } from '../../types';
import { useGuidedFlow } from '../../utils/useGuidedFlow';
import { Icon } from '../common/Icon';
import { GuidedAnswer } from './GuidedAnswer';

export function GuidedSetup({ records, knownBusinessModel, initialMonth, onClose, onComplete }: GuidedSetupProps) {
  const flow = useGuidedFlow({ records, knownBusinessModel, initialMonth, onComplete });
  const { question, context, errorMessage, progress } = flow;
  const help = question.getHelp?.(context);
  const isConfirm = question.kind === 'confirm';
  const isReview = question.kind === 'review';
  const progressLabel = isReview ? 'Final check' : isConfirm ? 'Quick check' : `Question ${progress.current} of ${progress.total}`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isReview) flow.saveAnswers();
    else flow.goForward();
  };

  return (
    <section className="card guide">
      <header className="guide-head">
        <div>
          <span className="guide-step">{progressLabel}</span>
          <div className="meter guide-meter" role="progressbar" aria-label="Progress" aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.current}>
            <div className="meter-fill good" style={{ width: `${isReview ? 100 : (progress.current / progress.total) * 100}%` }} />
          </div>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close questions"><Icon name="close" /></button>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        <h1>{question.getPrompt(context)}</h1>
        {help && <p className="guide-help">{help}</p>}

        <div className="guide-answer"><GuidedAnswer flow={flow} /></div>

        {errorMessage && <p className="form-error" role="alert"><Icon name="alert" size={14} /> {errorMessage}</p>}

        <div className="guide-actions">
          {flow.canGoBack && <button type="button" className="btn ghost" onClick={flow.goBack}><Icon name="arrowLeft" size={15} />Back</button>}
          {isConfirm && <button type="button" className="btn ghost" onClick={flow.correctAnswer}>{question.correctLabel}</button>}
          {question.kind !== 'choice' && (
            <button className="btn primary">{isReview ? 'Build my dashboard' : isConfirm ? question.confirmLabel : 'Continue'}</button>
          )}
        </div>
      </form>
    </section>
  );
}
