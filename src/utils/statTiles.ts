import type { BusinessMetrics, Currency, MetricCalculation, MetricTermKey, StatTileData, TileSize, TileTone } from '../types';
import { formatPercent, formatUnitMoney, formatWholeNumber } from './format';
import { METRIC_TERMS } from './metricTerms';

type TileKey = Extract<MetricTermKey,
  'churnRate' | 'retentionRate' | 'customersLost' | 'customersRetained' | 'customersAtRisk' | 'customersSaved' | 'saveRate'
  | 'costPerSale' | 'profitPerSale' | 'pricePerSale'>;

/**
 * Where a rate turns from good to needing attention. Retention is good from 70%;
 * churn mirrors it (churn = 100% - retention), so it is good below 30%.
 */
export const GOOD_RETENTION_PERCENT = 70;
const GOOD_CHURN_PERCENT = 100 - GOOD_RETENTION_PERCENT;
const GOOD_SAVE_RATE_PERCENT = 50;

/** Green past the threshold on the good side, red on the bad side, neutral exactly on it. */
function getRateTone(percent: number | null, threshold: number, isHigherBetter: boolean): TileTone {
  if (percent === null || percent === threshold) return 'neutral';
  return (percent > threshold) === isHigherBetter ? 'positive' : 'negative';
}

/** Green for a profit, red for a loss, neutral for exactly zero or a skipped answer. */
function getProfitTone(amount: number | null): TileTone {
  if (amount === null || amount === 0) return 'neutral';
  return amount > 0 ? 'positive' : 'negative';
}

const STATUS_LABELS: Partial<Record<TileTone, string>> = { positive: 'Good', negative: 'Needs attention' };

interface TileDefinition {
  format: (value: number, currency: Currency) => string;
  getTone: (value: number | null) => TileTone;
  size: TileSize;
  /** Rates and profits get a plain-words verdict; plain counts do not */
  hasStatus?: boolean;
  emptyMessage?: string;
}

const NO_RISK_MESSAGE = 'No customers were at risk, so there is nothing to measure.';
const SKIPPED_MESSAGE = 'Skipped. Add it under Your answers if it applies to your business.';

const TILE_DEFINITIONS: Record<TileKey, TileDefinition> = {
  retentionRate: { format: formatPercent, getTone: (value) => getRateTone(value, GOOD_RETENTION_PERCENT, true), size: 'featured', hasStatus: true },
  churnRate: { format: formatPercent, getTone: (value) => getRateTone(value, GOOD_CHURN_PERCENT, false), size: 'featured', hasStatus: true },
  customersRetained: { format: formatWholeNumber, getTone: () => 'positive', size: 'compact' },
  customersLost: { format: formatWholeNumber, getTone: () => 'warning', size: 'compact' },
  saveRate: { format: formatPercent, getTone: (value) => getRateTone(value, GOOD_SAVE_RATE_PERCENT, true), size: 'featured', hasStatus: true, emptyMessage: NO_RISK_MESSAGE },
  customersAtRisk: { format: formatWholeNumber, getTone: () => 'warning', size: 'compact' },
  customersSaved: { format: formatWholeNumber, getTone: () => 'positive', size: 'compact' },
  profitPerSale: { format: formatUnitMoney, getTone: getProfitTone, size: 'featured', hasStatus: true, emptyMessage: SKIPPED_MESSAGE },
  costPerSale: { format: formatUnitMoney, getTone: () => 'neutral', size: 'compact', emptyMessage: SKIPPED_MESSAGE },
  pricePerSale: { format: formatUnitMoney, getTone: () => 'neutral', size: 'compact', emptyMessage: 'Needs both the cost and the profit per sale.' },
};

/** Each group lists its headline metric first; the layout places every tile by its id. */
const CUSTOMER_TILE_KEYS: TileKey[] = ['retentionRate', 'churnRate', 'customersRetained', 'customersLost'];
const AT_RISK_TILE_KEYS: TileKey[] = ['saveRate', 'customersAtRisk', 'customersSaved'];
const PER_SALE_TILE_KEYS: TileKey[] = ['profitPerSale', 'costPerSale', 'pricePerSale'];

export function buildStatTiles(metrics: BusinessMetrics, calculations: Record<MetricTermKey, MetricCalculation>, currency: Currency) {
  const toTile = (key: TileKey): StatTileData => {
    const { format, getTone, size, hasStatus, emptyMessage = '' } = TILE_DEFINITIONS[key];
    const tone = getTone(metrics[key]);
    return {
      id: key,
      metric: METRIC_TERMS[key],
      calculation: calculations[key],
      value: metrics[key],
      format: (value) => format(value ?? 0, currency),
      tone,
      size,
      statusLabel: hasStatus && metrics[key] !== null ? STATUS_LABELS[tone] ?? null : null,
      emptyMessage,
    };
  };
  const hasPerSaleAnswers = metrics.costPerSale !== null || metrics.profitPerSale !== null;
  return {
    customerTiles: CUSTOMER_TILE_KEYS.map(toTile),
    atRiskTiles: AT_RISK_TILE_KEYS.map(toTile),
    perSaleTiles: hasPerSaleAnswers ? PER_SALE_TILE_KEYS.map(toTile) : [],
  };
}

/** The headline verdict for net profit, in plain words. */
export function getProfitStatus(netProfit: number): { tone: TileTone; label: string } {
  if (netProfit > 0) return { tone: 'positive', label: 'Profitable' };
  if (netProfit < 0) return { tone: 'negative', label: 'Losing money' };
  return { tone: 'neutral', label: 'Breaking even' };
}
