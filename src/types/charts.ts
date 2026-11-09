import type { TooltipContentProps } from 'recharts';

export interface ChartDatum {
  name: string;
  value: number;
  color: string;
}

export interface AmountBarChartProps {
  rows: ChartDatum[];
  format: (value: number) => string;
  tickFormat: (value: number) => string;
  height: number;
  ariaLabel: string;
}

export interface ShareDonutChartProps {
  rows: ChartDatum[];
  format: (value: number) => string;
  centerValue: string;
  centerLabel: string;
  height: number;
  ariaLabel: string;
}

export type ChartTooltipProps = TooltipContentProps & {
  format: (value: number) => string;
};
