import { useEffect, useState } from 'react';
import type { BusinessModel, MonthRecord, Theme, ViewName } from './types';
import { Icon } from './components/common/Icon';
import { DataView } from './components/data/DataView';
import { GuidedSetup } from './components/guided/GuidedSetup';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { Overview } from './components/overview/Overview';
import { applyTheme, getInitialTheme } from './utils/theme';
import { useDashboard } from './utils/useDashboard';

export function App() {
  const dashboard = useDashboard();
  const [currentView, setCurrentView] = useState<ViewName>('overview');
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const { toast, records, isSample } = dashboard;

  useEffect(() => applyTheme(theme), [theme]);

  const openGuide = () => setCurrentView('guide');

  const finishGuide = (record: MonthRecord, businessModel: BusinessModel) => {
    dashboard.saveGuidedMonth(record, businessModel);
    setCurrentView('overview');
  };

  return (
    <div className="app">
      <Navbar
        currentView={currentView}
        isSample={isSample}
        theme={theme}
        onNavigate={setCurrentView}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onAddMonth={openGuide}
      />

      {isSample && currentView !== 'guide' && (
        <div className="demo-banner" role="status">
          <Icon name="alert" size={15} />
          <span>You are viewing fictional demo data. None of these numbers are real.</span>
          <button className="btn primary small" onClick={openGuide}>Enter my numbers</button>
        </div>
      )}

      <main>
        {currentView === 'guide' && (
          <GuidedSetup
            records={isSample ? [] : records}
            knownBusinessModel={isSample ? null : dashboard.businessModel}
            onClose={() => setCurrentView('overview')}
            onComplete={finishGuide}
          />
        )}
        {currentView === 'overview' && (
          <Overview records={records} businessModel={dashboard.businessModel} targets={dashboard.targets} onTargetsChange={dashboard.updateTargets} onAddMonth={openGuide} />
        )}
        {currentView === 'data' && <DataView dashboard={dashboard} onAddMonth={openGuide} />}
      </main>

      <Footer />

      {toast && (
        <div className="toast" role="status" key={toast.toastId}>
          <span>{toast.message}</span>
          {toast.canUndo && <button onClick={dashboard.undoLastChange}>Undo</button>}
          <button className="toast-x" onClick={dashboard.dismissToast} aria-label="Dismiss"><Icon name="close" size={14} /></button>
        </div>
      )}
    </div>
  );
}
