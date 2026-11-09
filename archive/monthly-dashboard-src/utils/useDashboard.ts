import { useCallback, useEffect, useRef, useState } from 'react';
import type { BusinessModel, Dashboard, DashboardState, MonthRecord, Targets, ToastMessage } from '../types';
import { FIELDS } from './fields';
import { formatMonthLabel } from './format';
import { createSampleData, DEFAULT_TARGETS } from './sampleData';
import { EMPTY_TARGETS } from './targets';

const DATA_STORAGE_KEY = 'datadash.v1';
const TOAST_DURATION_MS = 7000;
const EMPTY_STATE: DashboardState = { records: [], targets: EMPTY_TARGETS, isSample: false, businessModel: null };

/** The demo is the home page, and what the dashboard returns to whenever no real data is left. */
const createDemoState = (): DashboardState =>
  ({ records: createSampleData(), targets: DEFAULT_TARGETS, isSample: true, businessModel: 'subscription' });

const sortByMonth = (records: MonthRecord[]) =>
  [...records].sort((first, second) => first.month.localeCompare(second.month));

/** A saved month needs real revenue, or every metric built on it would be meaningless. */
function isUsableRecord(candidate: unknown): candidate is MonthRecord {
  const record = candidate as MonthRecord;
  return (
    !!record && typeof record.month === 'string' && /^\d{4}-\d{2}$/.test(record.month) &&
    FIELDS.every((field) => typeof record[field.key] === 'number' && Number.isFinite(record[field.key])) &&
    record.revenue > 0
  );
}

function loadSavedState(): DashboardState {
  try {
    const saved = JSON.parse(localStorage.getItem(DATA_STORAGE_KEY) ?? 'null');
    if (!saved || !Array.isArray(saved.records)) return createDemoState();
    const isFromBeforeGuidedSetup = !saved.businessModel;
    if (isFromBeforeGuidedSetup && saved.isSample) return createDemoState();

    const records = sortByMonth(saved.records.filter(isUsableRecord));
    if (!records.length) return createDemoState();
    return {
      records,
      targets: isFromBeforeGuidedSetup ? EMPTY_TARGETS : { ...EMPTY_TARGETS, ...saved.targets },
      isSample: !!saved.isSample,
      businessModel: saved.businessModel ?? 'subscription',
    };
  } catch {
    return createDemoState();
  }
}

export function useDashboard(): Dashboard {
  const [state, setState] = useState<DashboardState>(loadSavedState);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const undoStateRef = useRef<DashboardState | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    try {
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* Storage unavailable: the session still works in memory. */
    }
  }, [state]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  const commitChange = useCallback((nextState: DashboardState, message?: string) => {
    undoStateRef.current = stateRef.current;
    setState(nextState);
    if (message) setToast({ toastId: Date.now(), message, canUndo: true });
  }, []);

  const saveRecord = useCallback((record: MonthRecord, message?: string) => {
    const current = stateRef.current;
    const otherRecords = current.records.filter((existing) => existing.month !== record.month);
    commitChange({ ...current, records: sortByMonth([...otherRecords, record]) }, message);
  }, [commitChange]);

  /** Real answers replace demo data rather than mixing with it. */
  const saveGuidedMonth = useCallback((record: MonthRecord, businessModel: BusinessModel) => {
    const current = stateRef.current;
    const base = current.isSample ? EMPTY_STATE : current;
    const otherRecords = base.records.filter((existing) => existing.month !== record.month);
    commitChange(
      { ...base, businessModel, records: sortByMonth([...otherRecords, record]) },
      `Saved ${formatMonthLabel(record.month)}`,
    );
  }, [commitChange]);

  const deleteRecord = useCallback((month: string) => {
    const current = stateRef.current;
    const records = current.records.filter((record) => record.month !== month);
    commitChange(records.length ? { ...current, records } : createDemoState(), `Deleted ${formatMonthLabel(month)}`);
  }, [commitChange]);

  const clearRecords = useCallback(() => commitChange(createDemoState(), 'All data cleared'), [commitChange]);

  const loadSampleData = useCallback(() => commitChange(createDemoState(), 'Showing fictional demo data'), [commitChange]);

  const updateTargets = useCallback((targets: Targets) => {
    commitChange({ ...stateRef.current, targets }, 'Targets updated');
  }, [commitChange]);

  const undoLastChange = useCallback(() => {
    if (undoStateRef.current) setState(undoStateRef.current);
    undoStateRef.current = null;
    setToast(null);
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  return {
    ...state, toast, saveRecord, saveGuidedMonth, deleteRecord, clearRecords,
    loadSampleData, updateTargets, undoLastChange, dismissToast,
  };
}
