import { useState } from 'react';
import type { TargetDraft, TargetsCardProps } from '../../types';
import { getMetricCalculation } from '../../utils/metricCalculations';
import { applyTargetDraft, buildTargetItems, createTargetDraft, evaluateTarget, TARGET_STATUS_ICONS, TARGET_STATUS_LABELS } from '../../utils/targets';
import { Icon } from '../common/Icon';
import { MetricHelp } from '../common/MetricHelp';

export function TargetsCard({ summary, targets, onSave }: TargetsCardProps) {
  const [draft, setDraft] = useState<TargetDraft | null>(null);
  const items = buildTargetItems(summary);
  const hasAnyTarget = items.some((item) => targets[item.key] !== null);

  const saveDraft = () => {
    if (!draft) return;
    onSave(applyTargetDraft(items, targets, draft));
    setDraft(null);
  };

  return (
    <section className="card span-5 targets-card">
      <header className="card-head">
        <div>
          <h2>KPI targets</h2>
          <p className="term-note">Key Performance Indicators - the few numbers that show whether the business is hitting its goals.</p>
        </div>
        {draft ? (
          <div className="row-gap">
            <button className="btn ghost small" onClick={() => setDraft(null)}>Cancel</button>
            <button className="btn primary small" onClick={saveDraft}>Save</button>
          </div>
        ) : (
          <button className="btn ghost small" onClick={() => setDraft(createTargetDraft(items, targets))}>{hasAnyTarget ? 'Edit' : 'Set targets'}</button>
        )}
      </header>

      <ul className="targets">
        {items.map((item) => {
          const { progress, status } = evaluateTarget(item, targets[item.key]);
          return (
            <li key={item.key}>
              <div className="target-top">
                <span className="target-name">{item.label}<MetricHelp calculation={getMetricCalculation(item.metricKey, summary)} /></span>
                {draft ? (
                  <label className="target-input">
                    <span className="sr">{item.label} target</span>
                    {item.unit === '$' && <em>$</em>}
                    <input inputMode="decimal" value={draft[item.key]} onChange={(event) => setDraft({ ...draft, [item.key]: event.target.value })} />
                    {item.unit && item.unit !== '$' && <em>{item.unit}</em>}
                  </label>
                ) : (
                  <span className="target-val">
                    <b>{item.value === null ? 'Not available yet' : item.format(item.value)}</b>{targets[item.key] !== null && ` ${item.isLowerBetter ? 'max' : 'of'} ${item.format(targets[item.key])}`}
                  </span>
                )}
                <span className={`status ${status}`}>
                  <Icon name={TARGET_STATUS_ICONS[status]} size={13} />{TARGET_STATUS_LABELS[status]}
                </span>
              </div>
              <p className="term-note target-note">{item.note}</p>
              <div className="meter" role="progressbar" aria-label={item.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
                <div className={`meter-fill ${status}`} style={{ width: `${progress * 100}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
