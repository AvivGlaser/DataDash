import type { BusinessAnswers, BusinessProfile, Currency, DashboardMode } from './business';

export interface DashboardState {
  answers: BusinessAnswers;
  profile: BusinessProfile;
  /** Which questions the answers cover. Older saves are Extended: they hold the customer answers. */
  mode: DashboardMode;
  isSample: boolean;
  /** The currency the user asked to see. Falls back to the entered currency without a rate. */
  displayCurrency: Currency;
  /** Answers saved before the latest questions existed. Prefills the questionnaire. */
  incompleteAnswers: Partial<BusinessAnswers> | null;
}

export interface ToastMessage {
  toastId: number;
  message: string;
}

export interface Dashboard extends DashboardState {
  toast: ToastMessage | null;
  submitAnswers: (answers: BusinessAnswers, profile: BusinessProfile, mode: DashboardMode) => void;
  updateAnswers: (answers: BusinessAnswers) => void;
  updateProfile: (profile: BusinessProfile) => void;
  clearAnswers: () => void;
  setDisplayCurrency: (currency: Currency) => void;
  undoLastChange: () => void;
  dismissToast: () => void;
}

export type Theme = 'light' | 'dark';

export type ViewName = 'dashboard' | 'questionnaire';

/**
 * Which questionnaire to show: the six Instant questions, the full Extended set,
 * or only the questions an Instant dashboard is missing.
 */
export type QuestionnaireFlow = 'instant' | 'extended' | 'upgrade';
