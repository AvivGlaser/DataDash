import type { UpgradeCardProps } from '../../types';
import { Icon } from '../common/Icon';

const UNLOCKS = ['Customer retention and churn', 'At-risk customers you saved', 'Profit, cost and price per sale'];

/** Invites an Instant user to add the Extended questions. Their current answers are kept. */
export function UpgradeCard({ onUpgrade }: UpgradeCardProps) {
  return (
    <section className="card upgrade-card" aria-labelledby="upgrade-title">
      <span className="upgrade-icon"><Icon name="barChart" size={24} /></span>
      <div className="upgrade-body">
        <h2 id="upgrade-title">Ready to go deeper?</h2>
        <p>Answer 6 more questions to unlock:</p>
        <ul>
          {UNLOCKS.map((item) => <li key={item}><Icon name="check" size={14} />{item}</li>)}
        </ul>
      </div>
      <div className="upgrade-action">
        <button className="btn primary" onClick={onUpgrade}>Unlock Extended <Icon name="arrowRight" size={16} /></button>
        <small>Your current answers are kept.</small>
      </div>
    </section>
  );
}
