export type Currency = 'USD' | 'ILS';

/** The four answers, all covering the past 12 months. Money is stored in the currency it was entered in. */
export interface BusinessAnswers {
  currency: Currency;
  revenue: number;
  expenses: number;
  customersLost: number;
  customersRetained: number;
  /** Customers who wanted to leave */
  customersAtRisk: number;
  /** At-risk customers who stayed */
  customersSaved: number;
}

export type AnswerKey = Exclude<keyof BusinessAnswers, 'currency'>;

/** What the user has typed so far, before validation */
export type AnswerDraft = Record<AnswerKey, string>;

export type AnswerErrors = Partial<Record<AnswerKey, string>>;

export interface AnswerFieldDefinition {
  key: AnswerKey;
  question: string;
  label: string;
  unit: 'money' | 'count';
  minimum: number;
  hint?: string;
}

export interface ExchangeRate {
  /** How many ILS one USD buys */
  usdToIls: number;
  /** The date the published rate applies to, as YYYY-MM-DD */
  rateDate: string;
  /** The local day this rate was downloaded, as YYYY-MM-DD */
  fetchedOn: string;
}

/** Every value shown on the dashboard. Money is already in the displayed currency. */
export interface BusinessMetrics {
  revenue: number;
  expenses: number;
  netProfit: number;
  /** Percent: 25 means 25% */
  netProfitMargin: number;
  customersLost: number;
  customersRetained: number;
  totalCustomers: number;
  /** Percent: 25 means 25% */
  churnRate: number;
  /** Percent: 75 means 75% */
  retentionRate: number;
  customersAtRisk: number;
  customersSaved: number;
  /** Percent of at-risk customers saved, or null when nobody was at risk */
  saveRate: number | null;
}

export type MetricTermKey =
  | 'revenue' | 'expenses' | 'netProfit' | 'netProfitMargin'
  | 'customersLost' | 'customersRetained' | 'churnRate' | 'retentionRate'
  | 'customersAtRisk' | 'customersSaved' | 'saveRate';

export interface MetricTerm {
  term: string;
  explanation: string;
  /** The calculation in words. Shown in the metric's question mark tooltip. */
  formula: string;
}

export interface MetricCalculation {
  term: string;
  formula: string;
  /** The formula filled in with the current numbers, or null when there is nothing to work out */
  worked: string | null;
}
