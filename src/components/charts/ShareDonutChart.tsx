import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { ShareDonutChartProps } from '../../types';
import { ChartTooltip } from './ChartTooltip';

export function ShareDonutChart({ rows, format, centerValue, centerLabel, height, ariaLabel }: ShareDonutChartProps) {
  return (
    <div className="donut" role="group" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Tooltip content={(tooltipProps) => <ChartTooltip {...tooltipProps} format={format} />} />
          <Pie data={rows} dataKey="value" nameKey="name" innerRadius="66%" outerRadius="92%" startAngle={90} endAngle={-270} stroke="var(--surface)" strokeWidth={2}>
            {rows.map((row) => <Cell key={row.name} fill={row.color} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="donut-center">
        <strong>{centerValue}</strong>
        <span>{centerLabel}</span>
      </div>
    </div>
  );
}
