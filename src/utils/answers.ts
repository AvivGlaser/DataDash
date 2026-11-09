import type { AnswerDraft, AnswerErrors, AnswerFieldDefinition, BusinessAnswers, Currency } from '../types';
import { formatWholeNumber } from './format';

export const ANSWER_FIELDS: AnswerFieldDefinition[] = [
  { key: 'revenue', question: 'What was your total business revenue over the past 12 months?', label: 'Revenue', unit: 'money', minimum: 1000 },
  { key: 'expenses', question: 'What were your total business expenses over the past 12 months?', label: 'Expenses', unit: 'money', minimum: 0 },
  { key: 'customersLost', question: 'How many customers did your business lose over the past 12 months?', label: 'Customers lost', unit: 'count', minimum: 0 },
  { key: 'customersRetained', question: 'How many customers did your business retain over the past 12 months?', label: 'Customers retained', unit: 'count', minimum: 10 },
  { key: 'customersAtRisk', question: 'How many customers were at risk over the past 12 months?', label: 'At-risk customers', unit: 'count', minimum: 0, hint: 'Customers who wanted to leave. Enter 0 if there were none.' },
  { key: 'customersSaved', question: 'How many at-risk customers were saved over the past 12 months?', label: 'Customers saved', unit: 'count', minimum: 0, hint: 'At-risk customers who stayed. Enter 0 if there were none.' },
];

export const DEMO_ANSWERS: BusinessAnswers = {
  currency: 'USD', revenue: 2400000, expenses: 1850000, customersLost: 180, customersRetained: 1620, customersAtRisk: 320, customersSaved: 140,
};

const WHOLE_NUMBER = /^\d+$/;
const DECIMAL_NUMBER = /^\d+(\.\d+)?$/;

/** Drops anything that cannot be part of a number as the user types. */
export const keepNumericCharacters = (field: AnswerFieldDefinition, text: string) =>
  text.replace(field.unit === 'money' ? /[^\d.,]/g : /[^\d,]/g, '');

const stripSeparators = (text: string) => text.trim().replace(/,/g, '');

function getFieldError(field: AnswerFieldDefinition, text: string): string | undefined {
  const digits = stripSeparators(text);
  if (!digits) return 'Enter a number to continue.';
  if (!(field.unit === 'money' ? DECIMAL_NUMBER : WHOLE_NUMBER).test(digits)) return 'Enter numbers only, for example 12500.';
  if (Number(digits) < field.minimum) return `Enter at least ${formatWholeNumber(field.minimum)}.`;
  return undefined;
}

export function getDraftErrors(draft: AnswerDraft): AnswerErrors {
  const errors: AnswerErrors = {};
  ANSWER_FIELDS.forEach((field) => {
    const error = getFieldError(field, draft[field.key]);
    if (error) errors[field.key] = error;
  });
  if (!Object.keys(errors).length) addCustomerConsistencyErrors(draft, errors);
  return errors;
}

/** Each answer can be fine alone while the customer numbers together are impossible. */
function addCustomerConsistencyErrors(draft: AnswerDraft, errors: AnswerErrors) {
  const readCount = (key: keyof AnswerDraft) => Number(stripSeparators(draft[key]));
  const retained = readCount('customersRetained');
  const totalCustomers = readCount('customersLost') + retained;
  const atRisk = readCount('customersAtRisk');
  const saved = readCount('customersSaved');

  if (atRisk > totalCustomers) errors.customersAtRisk = `This cannot be more than your ${formatWholeNumber(totalCustomers)} total customers (lost + retained).`;
  if (saved > atRisk) errors.customersSaved = `This cannot be more than the ${formatWholeNumber(atRisk)} at-risk customers.`;
  else if (saved > retained) errors.customersSaved = `Saved customers stayed, so this cannot be more than the ${formatWholeNumber(retained)} retained.`;
}

/** Returns complete answers, or null while anything is missing or invalid. */
export function parseDraft(draft: AnswerDraft, currency: Currency): BusinessAnswers | null {
  if (Object.keys(getDraftErrors(draft)).length) return null;
  const readNumber = (key: keyof AnswerDraft) => Number(stripSeparators(draft[key]));
  return {
    currency,
    revenue: readNumber('revenue'),
    expenses: readNumber('expenses'),
    customersLost: readNumber('customersLost'),
    customersRetained: readNumber('customersRetained'),
    customersAtRisk: readNumber('customersAtRisk'),
    customersSaved: readNumber('customersSaved'),
  };
}

/** Questions without an answer yet become blank fields, never zero. */
export const answersToDraft = (answers: Partial<BusinessAnswers> | null): AnswerDraft => ({
  revenue: String(answers?.revenue ?? ''),
  expenses: String(answers?.expenses ?? ''),
  customersLost: String(answers?.customersLost ?? ''),
  customersRetained: String(answers?.customersRetained ?? ''),
  customersAtRisk: String(answers?.customersAtRisk ?? ''),
  customersSaved: String(answers?.customersSaved ?? ''),
});

export function isValidAnswers(candidate: unknown): candidate is BusinessAnswers {
  const answers = candidate as BusinessAnswers;
  if (!answers || (answers.currency !== 'USD' && answers.currency !== 'ILS')) return false;
  return !Object.keys(getDraftErrors(answersToDraft(answers))).length;
}
