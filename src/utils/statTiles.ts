import type { BusinessMetrics, MetricCalculation, MetricTermKey, StatTileData, TileTone } from '../types';
import { formatPercent, formatWholeNumber } from './format';
import { METRIC_TERMS } from './metricTerms';

type TileKey = Extract<MetricTermKey, 'churnRate' | 'retentionRate' | 'customersLost' | 'customersRetained' | 'customersAtRisk' | 'customersSaved' | 'saveRate'>;

const TONE_THRESHOLD_PERCENT = 50;

/** Green past the threshold on the good side, red on the bad side, neutral exactly on it. */
function getRateTone(percent: number | null, isHigherBetter: boolean): TileTone {
  if (percent === null || percent === TONE_THRESHOLD_PERCENT) return 'neutral';
  return (percent > TONE_THRESHOLD_PERCENT) === isHigherBetter ? 'positive' : 'negative';
}

interface TileDefinition {
  format: (value: number) => string;
  getTone: (value: number | null) => TileTone;
}

const TILE_DEFINITIONS: Record<TileKey, TileDefinition> = {
  churnRate: { format: formatPercent, getTone: (value) => getRateTone(value, false) },
  retentionRate: { format: formatPercent, getTone: (value) => getRateTone(value, true) },
  customersLost: { format: formatWholeNumber, getTone: () => 'warning' },
  customersRetained: { format: formatWholeNumber, getTone: () => 'positive' },
  customersAtRisk: { format: formatWholeNumber, getTone: () => 'warning' },
  customersSaved: { format: formatWholeNumber, getTone: () => 'positive' },
  saveRate: { format: formatPercent, getTone: (value) => getRateTone(value, true) },
};

const CUSTOMER_TILE_KEYS: TileKey[] = ['churnRate', 'retentionRate', 'customersLost', 'customersRetained'];
const AT_RISK_TILE_KEYS: TileKey[] = ['customersAtRisk', 'customersSaved', 'saveRate'];

export function buildStatTiles(metrics: BusinessMetrics, calculations: Record<MetricTermKey, MetricCalculation>) {
  const toTile = (key: TileKey): StatTileData => {
    const { format, getTone } = TILE_DEFINITIONS[key];
    return {
      id: key,
      metric: METRIC_TERMS[key],
      calculation: calculations[key],
      value: metrics[key],
      format: (value) => format(value ?? 0),
      tone: getTone(metrics[key]),
      emptyMessage: 'No customers were at risk, so there is nothing to measure.',
    };
  };
  return { customerTiles: CUSTOMER_TILE_KEYS.map(toTile), atRiskTiles: AT_RISK_TILE_KEYS.map(toTile) };
}
