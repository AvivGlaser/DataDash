import type { StatTileProps } from '../../types';
import { Sparkline } from '../charts/Sparkline';
import { AnimatedNumber } from '../common/AnimatedNumber';
import { ChangeIndicator } from '../common/ChangeIndicator';
import { MetricHelp } from '../common/MetricHelp';

export function StatTile({ tile, comparisonLabel, onAddMonth }: StatTileProps) {
  return (
    <section className="card tile">
      <MetricHelp calculation={tile.calculation} />
      <h2>{tile.metric.term}</h2>
      <p className="term-note">{tile.metric.explanation}</p>
      {tile.value === null ? (
        <div className="tile-missing">
          <p>{tile.missingReason}</p>
          <button className="link" onClick={onAddMonth}>Add a month</button>
        </div>
      ) : (
        <>
          <div className="tile-value"><AnimatedNumber value={tile.value} format={tile.format} /></div>
          <ChangeIndicator change={tile.change} comparisonLabel={comparisonLabel} />
          <Sparkline values={tile.sparklineValues} />
        </>
      )}
    </section>
  );
}
