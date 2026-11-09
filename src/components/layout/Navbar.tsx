import type { NavbarProps } from '../../types';
import { CurrencyToggle } from '../common/CurrencyToggle';
import { Icon } from '../common/Icon';

export function Navbar({ currentView, isSample, theme, currency, onlyCurrency, onCurrencyChange, onToggleTheme, onOpenQuestionnaire }: NavbarProps) {
  const oppositeTheme = theme === 'dark' ? 'light' : 'dark';
  const isOnDashboard = currentView === 'dashboard';

  return (
    <header className="top">
      <div className="brand">
        <span className="brand-mark"><Icon name="chart" size={18} /></span>
        DataDash
      </div>
      <div className="top-actions">
        {isOnDashboard && <CurrencyToggle value={currency} onChange={onCurrencyChange} onlyCurrency={onlyCurrency} ariaLabel="Currency shown on the dashboard" />}
        <button className="icon-btn" onClick={onToggleTheme} aria-label={`Switch to ${oppositeTheme} theme`}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
        {isSample && isOnDashboard && <button className="btn primary" onClick={onOpenQuestionnaire}><Icon name="plus" size={15} />Enter my data</button>}
      </div>
    </header>
  );
}
