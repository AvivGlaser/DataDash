import type { BusinessModel, ChangeMode, MetricSummary, MonthRecord, StatTileData, StatTileId } from '../types';
import { formatMoney, formatMonthCount, formatPercent, formatPercentTwoDecimals, formatRatio, formatWholeNumber } from './format';
import { getMetricCalculation, getMissingReason } from './metricCalculations';
import { METRIC_TERMS } from './metricTerms';
import {
  calculateChange, getArpa, getCac, getChurnRate, getGrossMargin, getLtvCac, getNetMargin, getPaybackMonths, getRoi,
} from './metrics';

const SPARKLINE_MONTHS = 12;

const RECURRING_TOP_TILES: StatTileId[] = ['roi', 'churnRate', 'customersLost', 'activeCustomers'];
const RECURRING_BOTTOM_TILES: StatTileId[] = ['arpa', 'cac', 'ltvCac', 'cacPayback', 'netMargin'];
const ONE_TIME_TOP_TILES: StatTileId[] = ['roi', 'netMargin', 'grossMargin', 'cac'];

interface TileDefinition {
  getValue: (summary: MetricSummary) => number | null;
  getMonthlyValue: (record: MonthRecord) => number | null;
  format: (value: number | null) => string;
  isHigherBetter: boolean;
  changeMode: ChangeMode;
}

const TILE_DEFINITIONS: Record<StatTileId, TileDefinition> = {
  roi: { getValue: (summary) => summary.roi, getMonthlyValue: getRoi, format: formatPercent, isHigherBetter: true, changeMode: 'points' },
  churnRate: { getValue: (summary) => summary.churnRate, getMonthlyValue: getChurnRate, format: formatPercentTwoDecimals, isHigherBetter: false, changeMode: 'points' },
  customersLost: { getValue: (summary) => summary.churned, getMonthlyValue: (record) => record.churnedCustomers, format: formatWholeNumber, isHigherBetter: false, changeMode: 'relative' },
  activeCustomers: { getValue: (summary) => summary.customers, getMonthlyValue: (record) => record.customers, format: formatWholeNumber, isHigherBetter: true, changeMode: 'relative' },
  arpa: { getValue: (summary) => summary.arpa, getMonthlyValue: getArpa, format: formatMoney, isHigherBetter: true, changeMode: 'relative' },
  cac: { getValue: (summary) => summary.cac, getMonthlyValue: getCac, format: formatMoney, isHigherBetter: false, changeMode: 'relative' },
  ltvCac: { getValue: (summary) => summary.ltvCac, getMonthlyValue: getLtvCac, format: formatRatio, isHigherBetter: true, changeMode: 'relative' },
  cacPayback: { getValue: (summary) => summary.paybackMonths, getMonthlyValue: getPaybackMonths, format: formatMonthCount, isHigherBetter: false, changeMode: 'relative' },
  netMargin: { getValue: (summary) => summary.netMargin, getMonthlyValue: getNetMargin, format: formatPercent, isHigherBetter: true, changeMode: 'points' },
  grossMargin: { getValue: (summary) => summary.grossMargin, getMonthlyValue: getGrossMargin, format: formatPercent, isHigherBetter: true, changeMode: 'points' },
};

function buildTile(id: StatTileId, summary: MetricSummary, priorSummary: MetricSummary | null, records: MonthRecord[]): StatTileData {
  const definition = TILE_DEFINITIONS[id];
  const previousValue = priorSummary ? definition.getValue(priorSummary) : null;
  return {
    id,
    metric: METRIC_TERMS[id],
    calculation: getMetricCalculation(id, summary),
    value: definition.getValue(summary),
    format: definition.format,
    change: calculateChange(definition.getValue(summary), previousValue, definition.isHigherBetter, definition.changeMode),
    sparklineValues: records.slice(-SPARKLINE_MONTHS).map(definition.getMonthlyValue),
    missingReason: getMissingReason(id, summary),
  };
}

/** Chooses the tiles that apply to this kind of business. */
export function buildStatTiles(
  businessModel: BusinessModel | null,
  summary: MetricSummary,
  priorSummary: MetricSummary | null,
  records: MonthRecord[],
) {
  const isOneTime = businessModel === 'oneTime';
  const toTile = (id: StatTileId) => buildTile(id, summary, priorSummary, records);
  return {
    topTiles: (isOneTime ? ONE_TIME_TOP_TILES : RECURRING_TOP_TILES).map(toTile),
    bottomTiles: isOneTime ? [] : RECURRING_BOTTOM_TILES.map(toTile),
  };
}
