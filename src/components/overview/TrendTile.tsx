import type { TrendTileProps } from '../../types';
import { formatSignedPercent } from '../../utils/format';
import { useHoverReplay } from '../../utils/useHoverReplay';
import { AnimatedNumber } from '../common/AnimatedNumber';
import { BasisTag } from '../common/BasisTag';
import { Icon } from '../common/Icon';
import { KpiHeader } from '../common/KpiHeader';

const formatChange = (value: number | null) => formatSignedPercent(value ?? 0);

/** A year-on-year change: a percent when both amounts are known, otherwise the direction in words. */
export function TrendTile({ tile }: TrendTileProps) {
  const { replayKey, hoverProps } = useHoverReplay();
  return (
    <section className={`card tile kpi tile-standard trend-tile tone-${tile.tone}`} {...hoverProps}>
      <KpiHeader metric={tile.metric} calculation={tile.calculation} />
      <div className="kpi-foot">
        <div className={`trend-value${tile.percent === null ? ' is-word' : ''}`}>
          <span className="trend-arrow"><Icon name={tile.icon} size={20} /></span>
          {tile.percent === null
            ? <span>{tile.valueText}</span>
            : <AnimatedNumber value={tile.percent} format={formatChange} replayKey={replayKey} />}
        </div>
        {tile.basis && <BasisTag basis={tile.basis} />}
      </div>
      <p className="trend-detail">{tile.detail}</p>
    </section>
  );
}
