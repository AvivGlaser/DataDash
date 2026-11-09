import type { TrendPromptProps } from '../../types';
import { Icon } from '../common/Icon';

export function TrendPrompt({ className, isRecurring, onAddMonth }: TrendPromptProps) {
  const unlocked = isRecurring
    ? 'revenue and cost trends, churn charts, customer movement and the ARR scenario planner'
    : 'revenue and cost trends';

  return (
    <section className={`card trend-prompt ${className}`}>
      <span className="drop-icon"><Icon name="chart" size={22} /></span>
      <div>
        <h2>Add one more month to see trends</h2>
        <p>A trend needs at least two months to be accurate. Adding a month unlocks {unlocked}.</p>
      </div>
      <button className="btn primary" onClick={onAddMonth}><Icon name="plus" size={15} />Add a month</button>
    </section>
  );
}
