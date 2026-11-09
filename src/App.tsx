import { useEffect, useState } from 'react';
import type { BusinessAnswers, Theme, ViewName } from './types';
import { Icon } from './components/common/Icon';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { Overview } from './components/overview/Overview';
import { Questionnaire } from './components/questionnaire/Questionnaire';
import { getShownCurrency } from './utils/currency';
import { applyTheme, getInitialTheme } from './utils/theme';
import { useDashboard } from './utils/useDashboard';
import { useExchangeRate } from './utils/useExchangeRate';

export function App() {
  const dashboard = useDashboard();
  const rate = useExchangeRate();
  const [currentView, setCurrentView] = useState<ViewName>('dashboard');
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const { toast, answers, isSample, displayCurrency } = dashboard;
  const currency = getShownCurrency(answers.currency, displayCurrency, rate);

  useEffect(() => applyTheme(theme), [theme]);

  const openQuestionnaire = () => setCurrentView('questionnaire');

  const finishQuestionnaire = (submittedAnswers: BusinessAnswers) => {
    dashboard.submitAnswers(submittedAnswers);
    setCurrentView('dashboard');
  };

  return (
    <div className="app">
      <Navbar
        currentView={currentView}
        isSample={isSample}
        theme={theme}
        currency={currency}
        onlyCurrency={rate ? undefined : answers.currency}
        onCurrencyChange={dashboard.setDisplayCurrency}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onOpenQuestionnaire={openQuestionnaire}
      />

      {isSample && currentView === 'dashboard' && (
        <div className="demo-banner" role="status">
          <Icon name="alert" size={15} />
          <span>You are viewing fictional demo data. None of these numbers are real.</span>
          <button className="btn primary small" onClick={openQuestionnaire}>Enter my numbers</button>
        </div>
      )}

      <main>
        {currentView === 'questionnaire' ? (
          <Questionnaire initialAnswers={dashboard.incompleteAnswers} onClose={() => setCurrentView('dashboard')} onComplete={finishQuestionnaire} />
        ) : (
          <Overview
            answers={answers}
            isSample={isSample}
            currency={currency}
            isConversionUnavailable={!rate && displayCurrency !== answers.currency}
            rate={rate}
            onAnswersChange={dashboard.updateAnswers}
            onClearAnswers={dashboard.clearAnswers}
          />
        )}
      </main>

      <Footer />

      {toast && (
        <div className="toast" role="status" key={toast.toastId}>
          <span>{toast.message}</span>
          <button onClick={dashboard.undoLastChange}>Undo</button>
          <button className="toast-x" onClick={dashboard.dismissToast} aria-label="Dismiss"><Icon name="close" size={14} /></button>
        </div>
      )}
    </div>
  );
}
