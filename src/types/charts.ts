import type { TooltipContentProps } from 'recharts';

export interface ChartDatum {
  name: string;
  value: number;
  color: string;
}

/** One piece of the "where your revenue goes" bar */
export interface SplitSegment {
  id: 'expenses' | 'profit' | 'coveredByRevenue' | 'loss';
  label: string;
  amount: string;
  /** Percent of the whole bar, 0 to 100 */
  share: number;
  /** Shown next to the amount, such as "77.1% of revenue" */
  shareText: string;
  color: string;
}

export interface RevenueSplit {
  /** The one-sentence takeaway, split so the amount can be emphasized */
  headline: { before: string; amount: string; after: string };
  segments: SplitSegment[];
  /** What the full bar stands for, such as "$2,400,000 revenue" */
  totalLabel: string;
  ariaLabel: string;
}

export interface RevenueSplitChartProps {
  split: RevenueSplit;
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
