/** One month of business data. This is the only data the dashboard stores. */
export interface MonthRecord {
  /** Formatted as YYYY-MM */
  month: string;
  mrr: number;
  revenue: number;
  customers: number;
  newCustomers: number;
  churnedCustomers: number;
  salesMarketing: number;
  cogs: number;
  totalCosts: number;
}

export type BusinessModel = 'subscription' | 'mixed' | 'oneTime';

export type NumericField = Exclude<keyof MonthRecord, 'month'>;

export interface FieldDefinition {
  key: NumericField;
  label: string;
  hint: string;
  isMoney: boolean;
  /** False when a zero would make the dashboard's calculations meaningless */
  isZeroAllowed: boolean;
  isRecurringOnly: boolean;
}

/** A target stays null until the user sets it, so no goal is ever invented for them. */
export interface Targets {
  arr: number | null;
  /** Stored as a fraction: 0.2 means 20% */
  roi: number | null;
  /** Monthly, stored as a fraction: 0.02 means 2% */
  churn: number | null;
  ltvCac: number | null;
  customers: number | null;
}

export interface MetricSummary {
  monthCount: number;
  arr: number;
  mrr: number;
  customers: number;
  revenue: number;
  costs: number;
  cogs: number;
  salesMarketing: number;
  startingCustomers: number;
  profit: number;
  roi: number | null;
  netMargin: number | null;
  grossMargin: number | null;
  /** Average monthly customer churn, weighted by customer base */
  churnRate: number | null;
  churned: number;
  newCustomers: number;
  arpa: number | null;
  cac: number | null;
  ltv: number | null;
  ltvCac: number | null;
  paybackMonths: number | null;
}

export interface ComparisonWindows {
  current: MonthRecord[];
  /** The equal-length period before `current`, or null when it is incomplete */
  prior: MonthRecord[] | null;
}

export interface MetricTerm {
  term: string;
  explanation: string;
  /** The calculation in words. Shown in the metric's question mark tooltip. */
  formula: string;
}

export type MetricTermKey =
  | 'arr' | 'mrr' | 'revenue' | 'totalCosts' | 'netProfit' | 'roi' | 'churnRate' | 'customersLost'
  | 'activeCustomers' | 'newCustomers' | 'arpa' | 'cac' | 'ltvCac' | 'cacPayback' | 'netMargin'
  | 'grossMargin' | 'cogs' | 'arrForecast';

export interface MetricCalculation {
  term: string;
  formula: string;
  /** The formula filled in with the current numbers, or null when it cannot be worked out */
  worked: string | null;
}

export type StatTileId = Extract<MetricTermKey,
  'roi' | 'churnRate' | 'customersLost' | 'activeCustomers' | 'arpa' | 'cac' | 'ltvCac' | 'cacPayback' | 'netMargin' | 'grossMargin'>;

export type TargetStatus = 'none' | 'unset' | 'good' | 'warn' | 'bad';

export type TargetDraft = Record<keyof Targets, string>;

export interface TargetItem {
  key: keyof Targets;
  metricKey: MetricTermKey;
  label: string;
  note: string;
  value: number | null;
  format: (value: number | null) => string;
  isLowerBetter: boolean;
  /** Multiplier between the stored target and the number typed by the user */
  inputScale: number;
  unit: string;
}

export interface TargetEvaluation {
  progress: number;
  status: TargetStatus;
}

export interface ForecastResult {
  arrByMonth: number[];
}

export interface ForecastBaseline {
  churnPercent: number;
  newCustomersPerMonth: number;
  arpa: number;
}

export type ChangeMode = 'relative' | 'points';
