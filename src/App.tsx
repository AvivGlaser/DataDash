import { useEffect, useState } from 'react';
import type { BusinessAnswers, BusinessProfile, DashboardMode, QuestionnaireFlow, Theme, ViewName } from './types';
import { Icon } from './components/common/Icon';
import { Footer } from './components/layout/Footer';
import { WelcomeDialog } from './components/onboarding/WelcomeDialog';
import { Navbar } from './components/layout/Navbar';
import { Overview } from './components/overview/Overview';
import { Questionnaire } from './components/questionnaire/Questionnaire';
import { getShownCurrency } from './utils/currency';
import { hasSeenWelcome, markWelcomeSeen } from './utils/onboarding';
import { applyTheme, getInitialTheme } from './utils/theme';
import { useDashboard } from './utils/useDashboard';
import { useExchangeRate } from './utils/useExchangeRate';

export function App() {
  const dashboard = useDashboard();
  const rate = useExchangeRate();
  const [currentView, setCurrentView] = useState<ViewName>('dashboard');
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const { toast, answers, isSample, displayCurrency } = dashboard;
  // First-time visitors see the demo behind the welcome dialog; returning users go straight to their dashboard
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(() => isSample && !hasSeenWelcome());
  const [flow, setFlow] = useState<QuestionnaireFlow>('instant');
  const currency = getShownCurrency(answers.currency, displayCurrency, rate);

  useEffect(() => applyTheme(theme), [theme]);

  const openWelcome = () => setIsWelcomeOpen(true);

  const startQuestionnaire = (nextFlow: QuestionnaireFlow) => {
    setFlow(nextFlow);
    window.scrollTo(0, 0);
    setCurrentView('questionnaire');
  };

  const closeWelcome = () => {
    markWelcomeSeen();
    setIsWelcomeOpen(false);
  };

  const chooseMode = (mode: DashboardMode) => {
    closeWelcome();
    startQuestionnaire(mode);
  };

  const finishQuestionnaire = (submittedAnswers: BusinessAnswers, submittedProfile: BusinessProfile, mode: DashboardMode) => {
    dashboard.submitAnswers(submittedAnswers, submittedProfile, mode);
    window.scrollTo(0, 0);
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
        onOpenQuestionnaire={openWelcome}
      />

      {isSample && currentView === 'dashboard' && (
        <div className="demo-banner" role="status">
          <Icon name="alert" size={15} />
          <span>You are viewing fictional demo data. None of these numbers are real.</span>
          <button className="btn primary small" onClick={openWelcome}>Enter my numbers</button>
        </div>
      )}

      <main>
        {currentView === 'questionnaire' ? (
          <Questionnaire
            key={flow}
            flow={flow}
            initialAnswers={flow === 'upgrade' ? answers : dashboard.incompleteAnswers}
            initialProfile={flow === 'upgrade' ? dashboard.profile : null}
            onClose={() => setCurrentView('dashboard')}
            onComplete={finishQuestionnaire}
          />
        ) : (
          <Overview
            answers={answers}
            profile={dashboard.profile}
            mode={dashboard.mode}
            isSample={isSample}
            currency={currency}
            isConversionUnavailable={!rate && displayCurrency !== answers.currency}
            rate={rate}
            onAnswersChange={dashboard.updateAnswers}
            onProfileChange={dashboard.updateProfile}
            onClearAnswers={dashboard.clearAnswers}
            onOpenQuestionnaire={openWelcome}
            onUpgrade={() => startQuestionnaire('upgrade')}
          />
        )}
      </main>

      <Footer />

      <WelcomeDialog isOpen={isWelcomeOpen} onChoose={chooseMode} onExplore={closeWelcome} />

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
