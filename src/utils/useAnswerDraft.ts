import { useState } from 'react';
import type { AnswerDraft, AnswerDraftState, AnswerKey, BusinessAnswers, Currency } from '../types';
import { ANSWER_FIELDS, answersToDraft, getDraftErrors, keepNumericCharacters, parseDraft } from './answers';

/** Holds typed answers. `onValidChange` runs only when the whole set of answers is valid. */
export function useAnswerDraft(initialAnswers: Partial<BusinessAnswers> | null, onValidChange?: (answers: BusinessAnswers) => void): AnswerDraftState {
  const [draft, setDraft] = useState<AnswerDraft>(answersToDraft(initialAnswers));
  const [currency, setCurrency] = useState<Currency>(initialAnswers?.currency ?? 'USD');

  const publishIfValid = (nextDraft: AnswerDraft, nextCurrency: Currency) => {
    const answers = parseDraft(nextDraft, nextCurrency);
    if (answers) onValidChange?.(answers);
  };

  const updateField = (key: AnswerKey, text: string) => {
    const field = ANSWER_FIELDS.find((candidate) => candidate.key === key);
    if (!field) return;
    const nextDraft = { ...draft, [key]: keepNumericCharacters(field, text) };
    setDraft(nextDraft);
    publishIfValid(nextDraft, currency);
  };

  const updateCurrency = (nextCurrency: Currency) => {
    setCurrency(nextCurrency);
    publishIfValid(draft, nextCurrency);
  };

  return { draft, currency, errors: getDraftErrors(draft), updateField, updateCurrency };
}
