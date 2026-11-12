import type { InsightsCardProps } from '../../types';
import { BasisTag } from '../common/BasisTag';
import { Icon } from '../common/Icon';

/** A short list of conclusions, each with one practical next step. */
export function InsightsCard({ insights }: InsightsCardProps) {
  return (
    <ul className="insight-list">
      {insights.map((insight) => (
        <li key={insight.id} className={`card insight tone-${insight.tone}`}>
          <span className="insight-icon"><Icon name={insight.icon} size={20} /></span>
          <div className="insight-body">
            <h3>{insight.title}</h3>
            <p>{insight.finding}</p>
            <p className="insight-action"><Icon name="lightbulb" size={15} /><span><strong>Next step: </strong>{insight.action}</span></p>
            {insight.basis && <BasisTag basis={insight.basis} />}
          </div>
        </li>
      ))}
    </ul>
  );
}
