import type { BusinessMetrics, ChartDatum } from '../types';

export const buildCustomerRows = (metrics: BusinessMetrics): ChartDatum[] => [
  { name: 'Retained', value: metrics.customersRetained, color: 'var(--series-in)' },
  { name: 'Lost', value: metrics.customersLost, color: 'var(--series-out)' },
];
