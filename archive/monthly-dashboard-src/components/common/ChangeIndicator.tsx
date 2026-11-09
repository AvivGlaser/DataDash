import type { ChangeIndicatorProps } from '../../types';
import { Icon } from './Icon';

export function ChangeIndicator({ change, comparisonLabel }: ChangeIndicatorProps) {
  if (!change) return null;
  const toneClass = change.isGood === null ? '' : change.isGood ? 'good' : 'bad';
  return (
    <span className={`delta ${toneClass}`}>
      <Icon name={change.direction} size={13} />
      <b>{change.text}</b> <span className="delta-on">{comparisonLabel}</span>
    </span>
  );
}
