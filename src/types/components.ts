import type { ReactNode } from 'react';
import type { CSSProperties } from 'react';
import type {
  AnswerChoices, AnswerDraft, AnswerErrors, AnswerFieldDefinition, AnswerGroup, AnswerKey, BusinessAnswers, BusinessCategory, BusinessCategoryId,
  BusinessMetrics, BusinessProfile, Currency, DashboardMode, ExchangeRate, Insight, InsightBasis, MetricCalculation, MetricTerm, ProfileErrors, TrendChoice, TrendSubject,
} from './business';
import type { QuestionnaireFlow, Theme, ViewName } from './dashboard';

export type IconName =
  | 'up' | 'down' | 'flat' | 'check' | 'alert' | 'clock' | 'plus' | 'arrowLeft'
  | 'download' | 'trash' | 'sun' | 'moon' | 'close' | 'table' | 'chart' | 'file'
  | 'chevronDown' | 'pencil' | 'cup' | 'bag' | 'briefcase' | 'heartPulse' | 'laptop' | 'shapes'
  | 'moneyBag' | 'trendUp' | 'trendDown' | 'receipt' | 'percent' | 'repeat' | 'userCheck' | 'userMinus'
  | 'userAlert' | 'lifebuoy' | 'shield' | 'box' | 'coin' | 'tag' | 'bolt' | 'lightbulb' | 'sparkle' | 'arrowRight' | 'help' | 'barChart';

export interface IconProps {
  name: IconName;
  size?: number;
}

export interface AnimatedNumberProps {
  value: number | null;
  format: (value: number | null) => string;
  /** Changing it replays the count from zero */
  replayKey?: number;
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

export interface FormErrorProps {
  /** Nothing is shown when there is no message */
  message?: string;
}

export interface KpiHeaderProps {
  metric: MetricTerm;
  calculation: MetricCalculation;
  iconSize?: number;
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
  size: TileSize;
  /** A plain-words verdict such as "Needs attention", or null when the number speaks for itself */
  statusLabel: string | null;
  /** Shown instead of a number when value is null */
  emptyMessage: string;
}

export type TileTone = 'positive' | 'negative' | 'warning' | 'neutral';

/** Featured cards carry the headline number of their group; compact ones hold supporting counts */
export type TileSize = 'featured' | 'standard' | 'compact';

export interface StatTileProps {
  tile: StatTileData;
}

export interface HeroFactData {
  id: string;
  icon: IconName;
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

/** A year-on-year change card. Exact changes show a percent; the user's own impression shows a word. */
export interface TrendTileData {
  id: TrendSubject;
  metric: MetricTerm;
  calculation: MetricCalculation;
  tone: TileTone;
  /** The direction arrow */
  icon: IconName;
  /** The percent change when it can be worked out, otherwise null and valueText is shown */
  percent: number | null;
  valueText: string;
  detail: string;
  /** Where the value comes from, or null when there is no answer */
  basis: InsightBasis | null;
}

export interface TrendTileProps {
  tile: TrendTileData;
}

export interface BasisTagProps {
  basis: InsightBasis;
}

export interface InsightsCardProps {
  insights: Insight[];
}

export interface UpgradeCardProps {
  onUpgrade: () => void;
}

export interface WelcomeDialogProps {
  isOpen: boolean;
  onChoose: (mode: DashboardMode) => void;
  /** Closes the dialog and shows the demo dashboard */
  onExplore: () => void;
}

export interface OverviewProps {
  answers: BusinessAnswers;
  profile: BusinessProfile;
  mode: DashboardMode;
  /** Opens the questions an Instant dashboard is missing */
  onUpgrade: () => void;
  isSample: boolean;
  currency: Currency;
  isConversionUnavailable: boolean;
  rate: ExchangeRate | null;
  onAnswersChange: (answers: BusinessAnswers) => void;
  onProfileChange: (profile: BusinessProfile) => void;
  onClearAnswers: () => void;
  /** Opens the questionnaire, so demo viewers can switch to their own numbers */
  onOpenQuestionnaire: () => void;
}

export interface BusinessHeaderProps {
  profile: BusinessProfile;
  isSample: boolean;
  /** Opens the business details: the questionnaire on the demo, the Your answers card otherwise */
  onEdit?: () => void;
}

export interface ProfileDraftState {
  businessName: string;
  category: BusinessCategoryId | null;
  errors: ProfileErrors;
  updateBusinessName: (text: string) => void;
  updateCategory: (category: BusinessCategoryId) => void;
}

export interface ProfileFieldsProps {
  profileState: ProfileDraftState;
  showAllErrors: boolean;
}

export interface CategoryIconProps {
  category: BusinessCategory;
  size?: number;
}

export interface CategoryPickerProps {
  inputId: string;
  labelId: string;
  value: BusinessCategoryId | null;
  hasError: boolean;
  onChange: (category: BusinessCategoryId) => void;
  onBlur: () => void;
}

export interface ExchangeRateNoteProps {
  enteredCurrency: Currency;
  currency: Currency;
  rate: ExchangeRate | null;
  isConversionUnavailable: boolean;
}

export interface AnswerDraftState {
  draft: AnswerDraft;
  choices: AnswerChoices;
  currency: Currency;
  errors: AnswerErrors;
  updateField: (key: AnswerKey, text: string) => void;
  updateTrend: (subject: TrendSubject, choice: TrendChoice) => void;
  updateEstimate: (subject: TrendSubject, isEstimate: boolean) => void;
  updateCurrency: (currency: Currency) => void;
}

export interface AnswerFieldProps {
  field: AnswerFieldDefinition;
  /** The question number, or null for a follow-up box inside a question */
  number: number | null;
  draftState: AnswerDraftState;
  /** Whether this field's error may be shown yet */
  showError: boolean;
  onVisit: () => void;
}

export interface TrendQuestionsProps {
  draftState: AnswerDraftState;
  subject: TrendSubject;
  /** The number of the amount question; the comparison question follows it */
  firstNumber: number;
  showAllErrors: boolean;
}

export interface AnswerFieldsProps {
  draftState: AnswerDraftState;
  group: AnswerGroup;
  /** The number shown before the group's first question */
  firstNumber: number;
  /** Shows every error at once, instead of waiting for each field to be visited */
  showAllErrors: boolean;
}

export interface AnswersCardProps {
  answers: BusinessAnswers;
  mode: DashboardMode;
  profile: BusinessProfile;
  onChange: (answers: BusinessAnswers) => void;
  onProfileChange: (profile: BusinessProfile) => void;
  onClear: () => void;
}

export interface QuestionnaireProps {
  flow: QuestionnaireFlow;
  /** Answers to start from: the current ones when upgrading, or ones saved before a question was added */
  initialAnswers: Partial<BusinessAnswers> | null;
  /** The current profile when upgrading, so it is not asked again */
  initialProfile: BusinessProfile | null;
  onClose: () => void;
  onComplete: (answers: BusinessAnswers, profile: BusinessProfile, mode: DashboardMode) => void;
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
