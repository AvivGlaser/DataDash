import type { TooltipContentProps } from 'recharts';

/** One point on the X axis: a label plus one value per series. */
export interface ChartRow {
  label: string;
  [dataKey: string]: string | number | null;
}

export interface ChartSeries {
  dataKey: string;
  name: string;
  color: string;
}

export interface ThresholdLine {
  value: number;
  label: string;
}

export interface TrendLineChartProps {
  rows: ChartRow[];
  series: ChartSeries[];
  format: (value: number) => string;
  tickFormat?: (value: number) => string;
  height: number;
  showArea?: boolean;
  isAnimated?: boolean;
  threshold?: ThresholdLine;
  ariaLabel: string;
}

export interface ColumnChartProps {
  rows: ChartRow[];
  series: ChartSeries[];
  format: (value: number) => string;
  height: number;
  ariaLabel: string;
}

export interface SparklineProps {
  values: (number | null)[];
}

export type ChartTooltipProps = TooltipContentProps & {
  format: (value: number) => string;
};
