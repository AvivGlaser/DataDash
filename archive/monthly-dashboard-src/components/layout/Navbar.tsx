import type { NavbarProps } from '../../types';
import { Icon } from '../common/Icon';

export function Navbar({ currentView, isSample, theme, onNavigate, onToggleTheme, onAddMonth }: NavbarProps) {
  const oppositeTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <header className="top">
      <div className="brand">
        <span className="brand-mark"><Icon name="chart" size={18} /></span>
        DataDash
      </div>
      <nav className="tabs" aria-label="Views">
        <button aria-current={currentView === 'overview' ? 'page' : undefined} onClick={() => onNavigate('overview')}>Overview</button>
        <button aria-current={currentView === 'data' ? 'page' : undefined} onClick={() => onNavigate('data')}>Data</button>
      </nav>
      <div className="top-actions">
        <button className="icon-btn" onClick={onToggleTheme} aria-label={`Switch to ${oppositeTheme} theme`}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
        <button className="btn primary" onClick={onAddMonth}><Icon name="plus" size={15} />{isSample ? 'Enter my data' : 'Add a month'}</button>
      </div>
    </header>
  );
}
