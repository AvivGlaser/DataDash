import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { AmountBarChartProps } from '../../types';
import { ChartTooltip } from './ChartTooltip';

const AXIS_TEXT = { fill: 'var(--muted)', fontSize: 11.5 };
const MAX_BAR_WIDTH = 72;

export function AmountBarChart({ rows, format, tickFormat, height, ariaLabel }: AmountBarChartProps) {
  return (
    <div role="group" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={rows} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--grid)" />
          <XAxis dataKey="name" tick={AXIS_TEXT} tickLine={false} axisLine={false} />
          <YAxis tick={AXIS_TEXT} tickFormatter={tickFormat} tickLine={false} axisLine={false} width={64} />
          <Tooltip cursor={{ fill: 'var(--surface-2)' }} content={(tooltipProps) => <ChartTooltip {...tooltipProps} format={format} />} />
          <ReferenceLine y={0} stroke="var(--base)" />
          <Bar dataKey="value" radius={4} maxBarSize={MAX_BAR_WIDTH}>
            {rows.map((row) => <Cell key={row.name} fill={row.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
