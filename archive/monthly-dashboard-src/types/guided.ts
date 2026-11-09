import type { BusinessModel, MonthRecord } from './business';

export type GuidedNumberKey =
  | 'mrr' | 'revenue' | 'customers' | 'newCustomers' | 'churnedCustomers'
  | 'cogs' | 'salesMarketing' | 'otherCosts';

export interface GuidedAnswers extends Record<GuidedNumberKey, string> {
  businessModel: BusinessModel | null;
  month: string;
}

export type GuidedQuestionId =
  | 'businessModel' | 'month' | 'replaceMonth' | 'mrr' | 'revenue' | 'customers' | 'newCustomers'
  | 'churnedCustomers' | 'customerCheck' | 'cogs' | 'cogsCheck' | 'salesMarketing' | 'salesCheck'
  | 'otherCosts' | 'review';

export type GuidedQuestionKind = 'choice' | 'month' | 'number' | 'confirm' | 'review';

export interface GuidedContext {
  answers: GuidedAnswers;
  /** Months already saved. Empty while the dashboard is showing demo data. */
  records: MonthRecord[];
  isBusinessModelKnown: boolean;
}

export interface GuidedQuickFill {
  label: string;
  value: string;
}

export interface GuidedQuestion {
  id: GuidedQuestionId;
  kind: GuidedQuestionKind;
  isRelevant: (context: GuidedContext) => boolean;
  getPrompt: (context: GuidedContext) => string;
  getHelp?: (context: GuidedContext) => string;
  answerKey?: GuidedNumberKey;
  unit?: 'money' | 'count';
  isZeroAllowed?: boolean;
  /** Extra rule for this question. Returns an error message, or null when the answer is fine. */
  check?: (context: GuidedContext) => string | null;
  getQuickFill?: (context: GuidedContext) => GuidedQuickFill | null;
  confirmLabel?: string;
  correctLabel?: string;
  /** Where the "correct it" button of a confirm question leads */
  correctionTarget?: GuidedQuestionId;
}

export interface BusinessModelOption {
  value: BusinessModel;
  label: string;
  description: string;
}

export interface GuidedReviewRow {
  label: string;
  value: string;
  questionId: GuidedQuestionId | null;
}

export interface GuidedFlowOptions {
  records: MonthRecord[];
  knownBusinessModel: BusinessModel | null;
  initialMonth?: string;
  onComplete: (record: MonthRecord, businessModel: BusinessModel) => void;
}

export interface GuidedFlow {
  question: GuidedQuestion;
  context: GuidedContext;
  errorMessage: string;
  progress: { current: number; total: number };
  canGoBack: boolean;
  updateNumber: (key: GuidedNumberKey, value: string) => void;
  updateMonth: (month: string) => void;
  chooseBusinessModel: (businessModel: BusinessModel) => void;
  applyQuickFill: (key: GuidedNumberKey, value: string) => void;
  goForward: () => void;
  goBack: () => void;
  correctAnswer: () => void;
  editFromReview: (questionId: GuidedQuestionId) => void;
  saveAnswers: () => void;
}
