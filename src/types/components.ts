import type { ReactNode } from 'react';
import type { CSSProperties } from 'react';
import type { AnswerDraft, AnswerErrors, AnswerKey, BusinessAnswers, BusinessMetrics, Currency, ExchangeRate, MetricCalculation, MetricTerm } from './business';
import type { Theme, ViewName } from './dashboard';

export type IconName =
  | 'up' | 'down' | 'flat' | 'check' | 'alert' | 'clock' | 'plus' | 'arrowLeft'
  | 'download' | 'trash' | 'sun' | 'moon' | 'close' | 'table' | 'chart' | 'file';

export interface IconProps {
  name: IconName;
  size?: number;
}

export interface AnimatedNumberProps {
  value: number | null;
  format: (value: number | null) => string;
}

export interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

export interface LegendItem {
  name: string;
  color: string;
}

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  legend?: LegendItem[];
  table: TableData;
  calculation?: MetricCalculation;
  className?: string;
  children: ReactNode;
}

export interface MetricHelpProps {
  calculation: MetricCalculation;
}

export type TooltipPosition = Pick<CSSProperties, 'left' | 'top' | 'transform'>;

export interface CurrencyToggleProps {
  value: Currency;
  onChange: (currency: Currency) => void;
  ariaLabel: string;
  /** The only currency that can be picked, when conversion is unavailable */
  onlyCurrency?: Currency;
}

export interface StatTileData {
  id: string;
  metric: MetricTerm;
  calculation: MetricCalculation;
  value: number | null;
  format: (value: number | null) => string;
  tone: TileTone;
  /** Shown instead of a number when value is null */
  emptyMessage: string;
}

export type TileTone = 'positive' | 'negative' | 'warning' | 'neutral';

export interface StatTileProps {
  tile: StatTileData;
}

export interface HeroFactData {
  id: string;
  label: string;
  note: string;
  value: string;
  calculation: MetricCalculation;
}

export interface HeroCardProps {
  metrics: BusinessMetrics;
  answers: BusinessAnswers;
  currency: Currency;
  rate: ExchangeRate | null;
}

export interface OverviewProps {
  answers: BusinessAnswers;
  isSample: boolean;
  currency: Currency;
  isConversionUnavailable: boolean;
  rate: ExchangeRate | null;
  onAnswersChange: (answers: BusinessAnswers) => void;
  onClearAnswers: () => void;
}

export interface ExchangeRateNoteProps {
  enteredCurrency: Currency;
  currency: Currency;
  rate: ExchangeRate | null;
  isConversionUnavailable: boolean;
}

export interface AnswerDraftState {
  draft: AnswerDraft;
  currency: Currency;
  errors: AnswerErrors;
  updateField: (key: AnswerKey, text: string) => void;
  updateCurrency: (currency: Currency) => void;
}

export interface AnswerFieldsProps {
  draftState: AnswerDraftState;
  /** Shows every error at once, instead of waiting for each field to be visited */
  showAllErrors: boolean;
}

export interface AnswersCardProps {
  answers: BusinessAnswers;
  onChange: (answers: BusinessAnswers) => void;
  onClear: () => void;
}

export interface QuestionnaireProps {
  /** Answers saved before a question was added, so only the new ones need filling in */
  initialAnswers: Partial<BusinessAnswers> | null;
  onClose: () => void;
  onComplete: (answers: BusinessAnswers) => void;
}

export interface NavbarProps {
  currentView: ViewName;
  isSample: boolean;
  theme: Theme;
  currency: Currency;
  onlyCurrency?: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onToggleTheme: () => void;
  onOpenQuestionnaire: () => void;
}
