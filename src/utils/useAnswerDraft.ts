import { useState } from 'react';
import type { AnswerChoices, AnswerDraft, AnswerDraftState, AnswerKey, BusinessAnswers, Currency, DashboardMode, TrendChoice, TrendSubject } from '../types';
import { answersToChoices, answersToDraft, findField, getDraftErrors, keepNumericCharacters, parseDraft, TREND_KEYS } from './answers';

/**
 * Holds typed and picked answers for one mode.
 * `onValidChange` runs only when every answer the mode asks for is valid.
 */
export function useAnswerDraft(
  initialAnswers: Partial<BusinessAnswers> | null,
  mode: DashboardMode,
  onValidChange?: (answers: BusinessAnswers) => void,
): AnswerDraftState {
  const [draft, setDraft] = useState<AnswerDraft>(() => answersToDraft(initialAnswers));
  const [choices, setChoices] = useState<AnswerChoices>(() => answersToChoices(initialAnswers));
  const [currency, setCurrency] = useState<Currency>(initialAnswers?.currency ?? 'USD');

  const publish = (nextDraft: AnswerDraft, nextChoices: AnswerChoices, nextCurrency: Currency) => {
    const answers = parseDraft(nextDraft, nextChoices, nextCurrency, mode);
    if (answers) onValidChange?.(answers);
  };

  const updateField = (key: AnswerKey, text: string) => {
    const nextDraft = { ...draft, [key]: keepNumericCharacters(findField(key), text) };
    setDraft(nextDraft);
    publish(nextDraft, choices, currency);
  };

  const updateChoices = (change: Partial<AnswerChoices>) => {
    const nextChoices = { ...choices, ...change };
    setChoices(nextChoices);
    publish(draft, nextChoices, currency);
  };

  const updateCurrency = (nextCurrency: Currency) => {
    setCurrency(nextCurrency);
    publish(draft, choices, nextCurrency);
  };

  return {
    draft,
    choices,
    currency,
    errors: getDraftErrors(draft, choices, mode),
    updateField,
    updateTrend: (subject: TrendSubject, choice: TrendChoice) => updateChoices({ [TREND_KEYS[subject].trend]: choice }),
    updateEstimate: (subject: TrendSubject, isEstimate: boolean) => updateChoices({ [TREND_KEYS[subject].estimate]: isEstimate }),
    updateCurrency,
  };
}
