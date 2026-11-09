import type { ChartTooltipProps } from '../../types';

export function ChartTooltip({ active, label, payload, format }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="tip">
      <div className="tip-title">{label}</div>
      {payload.filter((item) => item.value !== null).map((item) => (
        <div className="tip-row" key={item.name}>
          <i style={{ background: item.color }} />
          <b>{format(Number(item.value))}</b>
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}
