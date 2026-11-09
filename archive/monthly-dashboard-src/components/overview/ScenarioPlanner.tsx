import { useState } from 'react';
import type { ScenarioPlannerProps } from '../../types';
import { buildForecastTable } from '../../utils/chartTables';
import { buildForecastRows } from '../../utils/chartData';
import { FORECAST_MONTHS, buildForecastLabels, projectArr } from '../../utils/forecast';
import { formatMoney, formatSignedMoney } from '../../utils/format';
import { getMetricCalculation } from '../../utils/metricCalculations';
import { TrendLineChart } from '../charts/TrendLineChart';
import { AnimatedNumber } from '../common/AnimatedNumber';
import { ChartCard } from '../common/ChartCard';

const TREND_COLOR = 'var(--series-base)';
const SCENARIO_COLOR = 'var(--series-scenario)';

export function ScenarioPlanner({ lastRecord, baseline }: ScenarioPlannerProps) {
  const [churnPercent, setChurnPercent] = useState(baseline.churnPercent);
  const [newCustomersPerMonth, setNewCustomersPerMonth] = useState(baseline.newCustomersPerMonth);
  const [priceChangePercent, setPriceChangePercent] = useState(0);

  const trendArr = projectArr(lastRecord, baseline).arrByMonth;
  const scenarioArr = projectArr(lastRecord, {
    churnPercent,
    newCustomersPerMonth,
    arpa: baseline.arpa * (1 + priceChangePercent / 100),
  }).arrByMonth;
  const finalArr = scenarioArr[FORECAST_MONTHS];
  const labels = buildForecastLabels(lastRecord.month);

  const sliders = [
    { label: 'Monthly churn', value: churnPercent, onChange: setChurnPercent, min: 0, max: Math.max(10, Math.ceil(baseline.churnPercent * 2)), step: 0.1, display: `${churnPercent.toFixed(1)}%` },
    { label: 'New customers per month', value: newCustomersPerMonth, onChange: setNewCustomersPerMonth, min: 0, max: Math.max(10, Math.round(baseline.newCustomersPerMonth * 2.5)), step: 1, display: Math.round(newCustomersPerMonth).toLocaleString('en-US') },
    { label: 'Price change', value: priceChangePercent, onChange: setPriceChangePercent, min: -20, max: 30, step: 1, display: `${priceChangePercent > 0 ? '+' : ''}${priceChangePercent}%` },
  ];

  const resetScenario = () => {
    setChurnPercent(baseline.churnPercent);
    setNewCustomersPerMonth(baseline.newCustomersPerMonth);
    setPriceChangePercent(0);
  };

  return (
    <ChartCard
      className="span-12"
      title="ARR scenario planner"
      subtitle="Move the sliders to see where Annual Recurring Revenue lands 12 months from now. Current trend holds the selected period's averages."
      legend={[{ name: 'Current trend', color: TREND_COLOR }, { name: 'Your scenario', color: SCENARIO_COLOR }]}
      table={buildForecastTable(labels, trendArr, scenarioArr)}
      calculation={getMetricCalculation('arrForecast')}
    >
      <div className="forecast">
        <div className="forecast-controls">
          {sliders.map((slider) => (
            <label key={slider.label} className="slider">
              <span>{slider.label}<b>{slider.display}</b></span>
              <input type="range" min={slider.min} max={slider.max} step={slider.step} value={slider.value} onChange={(event) => slider.onChange(Number(event.target.value))} />
            </label>
          ))}
          <div className="forecast-result">
            <div>
              <span>ARR in 12 months</span>
              <strong><AnimatedNumber value={finalArr} format={formatMoney} /></strong>
            </div>
            <div>
              <span>Versus current trend</span>
              <strong>{formatSignedMoney(finalArr - trendArr[FORECAST_MONTHS])}</strong>
            </div>
          </div>
          <button className="btn ghost small" onClick={resetScenario}>Reset to current trend</button>
        </div>
        <div className="forecast-chart">
          <TrendLineChart
            rows={buildForecastRows(labels, trendArr, scenarioArr)}
            series={[{ dataKey: 'trend', name: 'Current trend', color: TREND_COLOR }, { dataKey: 'scenario', name: 'Your scenario', color: SCENARIO_COLOR }]}
            format={formatMoney}
            isAnimated={false}
            height={280}
            ariaLabel="Projected ARR for the next 12 months, current trend against your scenario"
          />
        </div>
      </div>
    </ChartCard>
  );
}
