import type { StatTileProps } from '../../types';
import { useHoverReplay } from '../../utils/useHoverReplay';
import { getValueFitStyle } from '../../utils/valueFit';
import { AnimatedNumber } from '../common/AnimatedNumber';
import { KpiHeader } from '../common/KpiHeader';

export function StatTile({ tile }: StatTileProps) {
  const { replayKey, hoverProps } = useHoverReplay();
  return (
    <section className={`card tile kpi tile-${tile.size} tone-${tile.tone}`} style={{ gridArea: tile.id }} {...hoverProps}>
      <KpiHeader metric={tile.metric} calculation={tile.calculation} iconSize={tile.size === 'featured' ? 20 : 18} />
      {tile.value === null ? (
        <p className="tile-empty">{tile.emptyMessage}</p>
      ) : (
        <div className="kpi-foot">
          <div className="tile-value" style={getValueFitStyle(tile.format(tile.value))}><AnimatedNumber value={tile.value} format={tile.format} replayKey={replayKey} /></div>
          {tile.statusLabel && <span className="kpi-status">{tile.statusLabel}</span>}
        </div>
      )}
    </section>
  );
}
