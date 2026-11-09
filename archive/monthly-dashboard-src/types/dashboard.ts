import type { BusinessModel, MonthRecord, Targets } from './business';

export interface DashboardState {
  records: MonthRecord[];
  targets: Targets;
  isSample: boolean;
  /** Null until the user has answered the guided questions */
  businessModel: BusinessModel | null;
}

export interface ToastMessage {
  toastId: number;
  message: string;
  canUndo: boolean;
}

export interface Dashboard extends DashboardState {
  toast: ToastMessage | null;
  saveRecord: (record: MonthRecord, message?: string) => void;
  saveGuidedMonth: (record: MonthRecord, businessModel: BusinessModel) => void;
  deleteRecord: (month: string) => void;
  clearRecords: () => void;
  loadSampleData: () => void;
  updateTargets: (targets: Targets) => void;
  undoLastChange: () => void;
  dismissToast: () => void;
}

export type Theme = 'light' | 'dark';

export type ViewName = 'overview' | 'data' | 'guide';
