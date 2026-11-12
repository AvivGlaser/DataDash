import { useCallback, useEffect, useRef, useState } from 'react';
import type { BusinessAnswers, BusinessProfile, Currency, Dashboard, DashboardMode, DashboardState, ToastMessage } from '../types';
import { DEMO_ANSWERS, readSavedAnswers } from './answers';
import { DEMO_PROFILE, readSavedProfile } from './businessProfile';

const DATA_STORAGE_KEY = 'datadash.v2';
const TOAST_DURATION_MS = 7000;
const DEMO_STATE: DashboardState = { answers: DEMO_ANSWERS, profile: DEMO_PROFILE, mode: 'extended', isSample: true, displayCurrency: DEMO_ANSWERS.currency, incompleteAnswers: null };

/**
 * Older saves have no profile, per-sale or comparison answers, and no mode; they still load, with those parts left blank.
 * A save without a mode holds the customer answers, so it is Extended.
 */
function loadSavedState(): DashboardState {
  try {
    const saved = JSON.parse(localStorage.getItem(DATA_STORAGE_KEY) ?? 'null');
    if (!saved?.answers) return DEMO_STATE;
    const mode: DashboardMode = saved.mode === 'instant' ? 'instant' : 'extended';
    const answers = readSavedAnswers(saved.answers, mode);
    if (!answers) return { ...DEMO_STATE, incompleteAnswers: saved.answers };
    const isSample = !!saved.isSample;
    const displayCurrency: Currency = saved.displayCurrency === 'ILS' ? 'ILS' : 'USD';
    const profile = isSample ? DEMO_PROFILE : readSavedProfile(saved.profile);
    return { answers, profile, mode, isSample, displayCurrency, incompleteAnswers: saved.incompleteAnswers ?? null };
  } catch {
    return DEMO_STATE;
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

  const commitWithUndo = useCallback((nextState: DashboardState, message: string) => {
    undoStateRef.current = stateRef.current;
    setState(nextState);
    setToast({ toastId: Date.now(), message });
  }, []);

  const submitAnswers = useCallback((answers: BusinessAnswers, profile: BusinessProfile, mode: DashboardMode) => {
    commitWithUndo({ answers, profile, mode, isSample: false, displayCurrency: answers.currency, incompleteAnswers: null }, 'Dashboard updated with your answers');
  }, [commitWithUndo]);

  const updateProfile = useCallback((profile: BusinessProfile) => {
    setState((current) => ({ ...current, profile }));
  }, []);

  /** Live edits. Changing the entered currency also changes what is displayed. */
  const updateAnswers = useCallback((answers: BusinessAnswers) => {
    setState((current) => ({
      ...current,
      answers,
      displayCurrency: answers.currency === current.answers.currency ? current.displayCurrency : answers.currency,
    }));
  }, []);

  const clearAnswers = useCallback(() => commitWithUndo(DEMO_STATE, 'Your answers were cleared'), [commitWithUndo]);

  const setDisplayCurrency = useCallback((displayCurrency: Currency) => {
    setState((current) => ({ ...current, displayCurrency }));
  }, []);

  const undoLastChange = useCallback(() => {
    if (undoStateRef.current) setState(undoStateRef.current);
    undoStateRef.current = null;
    setToast(null);
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  return { ...state, toast, submitAnswers, updateAnswers, updateProfile, clearAnswers, setDisplayCurrency, undoLastChange, dismissToast };
}
