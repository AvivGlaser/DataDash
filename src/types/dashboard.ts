import type { BusinessAnswers, Currency } from './business';

export interface DashboardState {
  answers: BusinessAnswers;
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
  submitAnswers: (answers: BusinessAnswers) => void;
  updateAnswers: (answers: BusinessAnswers) => void;
  clearAnswers: () => void;
  setDisplayCurrency: (currency: Currency) => void;
  undoLastChange: () => void;
  dismissToast: () => void;
}

export type Theme = 'light' | 'dark';

export type ViewName = 'dashboard' | 'questionnaire';
