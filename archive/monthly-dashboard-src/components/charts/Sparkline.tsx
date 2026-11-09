import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';
import type { SparklineProps } from '../../types';

const SPARKLINE_HEIGHT = 36;

export function Sparkline({ values }: SparklineProps) {
  if (values.filter((value) => value !== null).length < 2) return null;
  const rows = values.map((value) => ({ value }));

  return (
    <div className="spark" aria-hidden="true">
      <ResponsiveContainer width="100%" height={SPARKLINE_HEIGHT}>
        <LineChart data={rows} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Line dataKey="value" stroke="var(--series-base)" strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
