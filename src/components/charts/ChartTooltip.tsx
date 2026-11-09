import type { ChartDatum, ChartTooltipProps } from '../../types';

export function ChartTooltip({ active, payload, format }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const datum = payload[0].payload as ChartDatum;
  return (
    <div className="tip">
      <div className="tip-title">{datum.name}</div>
      <div className="tip-row">
        <i style={{ background: datum.color }} />
        <b>{format(datum.value)}</b>
      </div>
    </div>
  );
}
