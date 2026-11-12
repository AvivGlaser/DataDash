import type { IconName } from './components';

export type Currency = 'USD' | 'ILS';

/** How much a dashboard asks for: the six core questions, or those plus the customer and per-sale questions */
export type DashboardMode = 'instant' | 'extended';

/** How this year compares with the 12 months before. Only 'exact' comes with an amount. */
export type TrendChoice = 'exact' | 'increased' | 'decreased' | 'same' | 'unsure';

export type TrendSubject = 'revenue' | 'expenses';

/**
 * The answers. The yearly ones cover the past 12 months. Money is stored in the currency it was entered in.
 * Customer and per-sale answers are null when they were not asked (Instant mode) or were skipped.
 */
export interface BusinessAnswers {
  currency: Currency;
  revenue: number;
  /** The user marked the revenue as a rough estimate */
  revenueIsEstimate: boolean;
  revenueTrend: TrendChoice;
  /** Revenue in the 12 months before, only when revenueTrend is 'exact' */
  previousRevenue: number | null;
  expenses: number;
  expensesIsEstimate: boolean;
  expensesTrend: TrendChoice;
  /** Expenses in the 12 months before, only when expensesTrend is 'exact' */
  previousExpenses: number | null;
  customersLost: number | null;
  customersRetained: number | null;
  /** Customers who wanted to leave */
  customersAtRisk: number | null;
  /** At-risk customers who stayed */
  customersSaved: number | null;
  /** Direct cost of one product sold or service delivered, or null when skipped */
  costPerSale: number | null;
  /** Profit from one product sold or service delivered, or null when skipped. Can be negative. */
  profitPerSale: number | null;
}

/** The answers typed into a number box */
export type AnswerKey =
  | 'revenue' | 'previousRevenue' | 'expenses' | 'previousExpenses'
  | 'customersLost' | 'customersRetained' | 'customersAtRisk' | 'customersSaved'
  | 'costPerSale' | 'profitPerSale';

/** What the user has typed so far, before validation */
export type AnswerDraft = Record<AnswerKey, string>;

/** The answers picked rather than typed */
export interface AnswerChoices {
  revenueTrend: TrendChoice | null;
  expensesTrend: TrendChoice | null;
  revenueIsEstimate: boolean;
  expensesIsEstimate: boolean;
}

export type AnswerErrors = Partial<Record<AnswerKey | 'revenueTrend' | 'expensesTrend', string>>;

/** Questions are shown in groups. The earlier-year amounts sit inside the revenue and expenses groups. */
export type AnswerGroup = 'revenue' | 'expenses' | 'customers' | 'perSale';

export interface AnswerFieldDefinition {
  key: AnswerKey;
  group: AnswerGroup;
  question: string;
  label: string;
  unit: 'money' | 'count';
  minimum: number;
  hint?: string;
  /** Can be left blank */
  isOptional?: boolean;
  /** Accepts a minus sign, and then has no minimum */
  allowNegative?: boolean;
}

export type BusinessCategoryId = 'food' | 'retail' | 'services' | 'wellness' | 'technology' | 'other';

export interface BusinessCategory {
  id: BusinessCategoryId;
  name: string;
  examples: string;
  icon: IconName;
  /** The costs worth checking first, in this kind of business */
  typicalCosts: string;
  /** A practical way this kind of business wins customers back */
  winBackIdea: string;
}

/** Who the dashboard belongs to. Kept apart from the numbers so either can change alone. */
export interface BusinessProfile {
  businessName: string;
  category: BusinessCategoryId | null;
}

export type ProfileErrors = Partial<Record<keyof BusinessProfile, string>>;

export interface ExchangeRate {
  /** How many ILS one USD buys */
  usdToIls: number;
  /** The date the published rate applies to, as YYYY-MM-DD */
  rateDate: string;
  /** The local day this rate was downloaded, as YYYY-MM-DD */
  fetchedOn: string;
}

/** A year-on-year change */
export interface PeriodChange {
  trend: TrendChoice;
  /** The amount for the 12 months before, in the displayed currency, or null when not entered */
  previous: number | null;
  /** Percent change: 12.5 means up 12.5%. Null unless the earlier amount was entered. */
  percent: number | null;
}

/** Every value shown on the dashboard. Money is already in the displayed currency. */
export interface BusinessMetrics {
  revenue: number;
  revenueIsEstimate: boolean;
  revenueChange: PeriodChange;
  expenses: number;
  expensesIsEstimate: boolean;
  expensesChange: PeriodChange;
  netProfit: number;
  /** Percent: 25 means 25% */
  netProfitMargin: number;
  /** False when the customer questions were not answered. The customer values below are then zero and must not be shown. */
  hasCustomerData: boolean;
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
  costPerSale: number | null;
  profitPerSale: number | null;
  /** Cost per sale + profit per sale, or null unless both were answered */
  pricePerSale: number | null;
}

export type MetricTermKey =
  | 'revenue' | 'expenses' | 'netProfit' | 'netProfitMargin' | 'revenueChange' | 'expensesChange'
  | 'customersLost' | 'customersRetained' | 'churnRate' | 'retentionRate'
  | 'customersAtRisk' | 'customersSaved' | 'saveRate'
  | 'costPerSale' | 'profitPerSale' | 'pricePerSale';

export interface MetricTerm {
  term: string;
  explanation: string;
  /** Shown in the metric's card so it can be recognized at a glance */
  icon: IconName;
  /** The calculation in words. Shown in the metric's question mark tooltip. */
  formula: string;
}

export interface MetricCalculation {
  term: string;
  formula: string;
  /** The formula filled in with the current numbers, or null when there is nothing to work out */
  worked: string | null;
}

/** Where a conclusion comes from, so exact results, estimates and the user's own impressions are never confused */
export type InsightBasis = 'exact' | 'estimate' | 'assessment';

export interface Insight {
  id: string;
  tone: 'positive' | 'negative' | 'warning' | 'neutral';
  icon: IconName;
  title: string;
  /** What the numbers say */
  finding: string;
  /** One practical next step */
  action: string;
  /** Null for a note about missing answers, which draws no conclusion */
  basis: InsightBasis | null;
}
