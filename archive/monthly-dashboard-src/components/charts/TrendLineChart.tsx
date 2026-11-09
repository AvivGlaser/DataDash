import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TrendLineChartProps } from '../../types';
import { ChartTooltip } from './ChartTooltip';

const AXIS_TEXT = { fill: 'var(--muted)', fontSize: 11.5 };

export function TrendLineChart({ rows, series, format, tickFormat = format, height, showArea = false, isAnimated = true, threshold, ariaLabel }: TrendLineChartProps) {
  return (
    <div role="group" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={rows} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--grid)" />
          <XAxis dataKey="label" tick={AXIS_TEXT} tickLine={false} axisLine={{ stroke: 'var(--base)' }} minTickGap={28} />
          <YAxis tick={AXIS_TEXT} tickFormatter={tickFormat} tickLine={false} axisLine={false} width={54} />
          <Tooltip cursor={{ stroke: 'var(--ink-2)' }} content={(tooltipProps) => <ChartTooltip {...tooltipProps} format={format} />} />
          {threshold && (
            <ReferenceLine
              y={threshold.value}
              ifOverflow="extendDomain"
              stroke="var(--ink-2)"
              strokeDasharray="4 4"
              label={{ value: threshold.label, position: 'insideTopRight', fill: 'var(--ink-2)', fontSize: 11.5 }}
            />
          )}
          {series.map((line) => (showArea ? (
            <Area key={line.dataKey} dataKey={line.dataKey} name={line.name} stroke={line.color} strokeWidth={2} fill={line.color} fillOpacity={0.14} isAnimationActive={isAnimated} />
          ) : (
            <Line key={line.dataKey} dataKey={line.dataKey} name={line.name} stroke={line.color} strokeWidth={2} dot={false} isAnimationActive={isAnimated} />
          )))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
