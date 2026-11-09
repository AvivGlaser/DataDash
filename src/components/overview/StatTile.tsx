import type { StatTileProps } from '../../types';
import { getValueFitStyle } from '../../utils/valueFit';
import { AnimatedNumber } from '../common/AnimatedNumber';
import { MetricHelp } from '../common/MetricHelp';

export function StatTile({ tile }: StatTileProps) {
  return (
    <section className={`card tile tone-${tile.tone}`}>
      <MetricHelp calculation={tile.calculation} />
      <h2>{tile.metric.term}</h2>
      <p className="term-note">{tile.metric.explanation}</p>
      {tile.value === null
        ? <p className="tile-empty">{tile.emptyMessage}</p>
        : <div className="tile-value" style={getValueFitStyle(tile.format(tile.value))}><AnimatedNumber value={tile.value} format={tile.format} /></div>}
    </section>
  );
}
