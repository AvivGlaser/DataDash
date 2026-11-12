import { useEffect, useRef } from 'react';
import type { WelcomeDialogProps } from '../../types';
import { Icon } from '../common/Icon';

/** The first screen a new visitor sees: what DataDash does, and a choice of how much to answer. */
export function WelcomeDialog({ isOpen, onChoose, onExplore }: WelcomeDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const instantRef = useRef<HTMLButtonElement>(null);

  // A modal dialog keeps keyboard focus inside it and makes the page behind it inert
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      instantRef.current?.focus();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="welcome"
      aria-labelledby="welcome-title"
      aria-describedby="welcome-intro"
      onCancel={(event) => {
        event.preventDefault();
        onExplore();
      }}
    >
      <button type="button" className="icon-btn welcome-close" onClick={onExplore} aria-label="Close and explore the demo"><Icon name="close" /></button>

      <header className="welcome-head">
        <span className="welcome-mark"><Icon name="chart" size={22} /></span>
        <p className="welcome-eyebrow">Welcome to DataDash</p>
        <h2 id="welcome-title">
          <span>Your Business.</span> <span>Your Numbers.</span> <span className="welcome-highlight">Your Next Move.</span>
        </h2>
        <p id="welcome-intro" className="welcome-intro">
          Turn a few simple answers into a personalized dashboard with clear insights and practical next steps, in minutes.
        </p>
      </header>

      <p className="welcome-choose" id="welcome-choose">Choose how you want to start</p>
      <div className="mode-options" role="group" aria-labelledby="welcome-choose">
        <button ref={instantRef} type="button" className="mode-card mode-instant" onClick={() => onChoose('instant')}>
          <span className="mode-badge"><Icon name="sparkle" size={12} />Recommended</span>
          <span className="mode-icon"><Icon name="bolt" size={24} /></span>
          <span className="mode-title">Instant Dashboard</span>
          <span className="mode-subtitle">Quick answers. Instant clarity.</span>
          <span className="mode-text">Answer just 6 simple questions and get an immediate snapshot of your business performance.</span>
          <span className="mode-facts">
            <span><Icon name="clock" size={14} />About 1 minute</span>
            <span><Icon name="check" size={14} />No documents needed</span>
          </span>
          <span className="mode-cta">Start with 6 questions <Icon name="arrowRight" size={16} /></span>
        </button>

        <button type="button" className="mode-card mode-extended" onClick={() => onChoose('extended')}>
          <span className="mode-icon"><Icon name="barChart" size={24} /></span>
          <span className="mode-title">Extended Dashboard</span>
          <span className="mode-subtitle">More details. Deeper insights.</span>
          <span className="mode-text">Share more about your business to unlock customer and per-sale KPIs, deeper analysis and more tailored tips.</span>
          <span className="mode-facts">
            <span><Icon name="clock" size={14} />About 3 minutes</span>
            <span><Icon name="userCheck" size={14} />Customer and per-sale insights</span>
          </span>
          <span className="mode-cta">Go deeper <Icon name="arrowRight" size={16} /></span>
        </button>
      </div>

      <footer className="welcome-foot">
        <button type="button" className="link" onClick={onExplore}>Just looking? Explore the demo first</button>
        <span className="welcome-privacy"><Icon name="shield" size={14} />Your answers stay in this browser. You can switch modes any time.</span>
      </footer>
    </dialog>
  );
}
