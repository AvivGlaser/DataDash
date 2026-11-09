import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ColumnChartProps } from '../../types';
import { ChartTooltip } from './ChartTooltip';

const AXIS_TEXT = { fill: 'var(--muted)', fontSize: 11.5 };
const MAX_COLUMN_WIDTH = 18;

/** Values below zero are drawn under the axis but always labelled as positive amounts. */
export function ColumnChart({ rows, series, format, height, ariaLabel }: ColumnChartProps) {
  const formatAmount = (value: number) => format(Math.abs(value));

  return (
    <div role="group" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={rows} stackOffset="sign" margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--grid)" />
          <XAxis dataKey="label" tick={AXIS_TEXT} tickLine={false} axisLine={false} minTickGap={28} />
          <YAxis tick={AXIS_TEXT} tickFormatter={formatAmount} tickLine={false} axisLine={false} width={42} allowDecimals={false} />
          <Tooltip cursor={{ fill: 'var(--surface-2)' }} content={(tooltipProps) => <ChartTooltip {...tooltipProps} format={formatAmount} />} />
          <ReferenceLine y={0} stroke="var(--base)" />
          {series.map((column) => (
            <Bar key={column.dataKey} dataKey={column.dataKey} name={column.name} fill={column.color} stackId="movement" radius={3} maxBarSize={MAX_COLUMN_WIDTH} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
