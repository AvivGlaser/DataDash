import type {
  AnswerChoices, AnswerDraft, AnswerErrors, AnswerFieldDefinition, AnswerGroup, AnswerKey, BusinessAnswers, Currency, DashboardMode, TrendChoice, TrendSubject,
} from '../types';
import { formatWholeNumber } from './format';

export const ANSWER_FIELDS: AnswerFieldDefinition[] = [
  {
    key: 'revenue', group: 'revenue', question: 'What was your total business revenue over the past 12 months?', label: 'Revenue', unit: 'money', minimum: 1000,
    hint: 'All the money that came in from sales, before any costs. A good estimate is fine.',
  },
  { key: 'previousRevenue', group: 'revenue', question: 'Revenue in the 12 months before that', label: 'Earlier revenue', unit: 'money', minimum: 1 },
  {
    key: 'expenses', group: 'expenses', question: 'What were your total business expenses over the past 12 months?', label: 'Expenses', unit: 'money', minimum: 0,
    hint: 'Rent, wages, stock, bills and everything else the business paid for. A good estimate is fine.',
  },
  { key: 'previousExpenses', group: 'expenses', question: 'Expenses in the 12 months before that', label: 'Earlier expenses', unit: 'money', minimum: 1 },
  { key: 'customersLost', group: 'customers', question: 'How many customers did your business lose over the past 12 months?', label: 'Customers lost', unit: 'count', minimum: 0 },
  { key: 'customersRetained', group: 'customers', question: 'How many customers did your business retain over the past 12 months?', label: 'Customers retained', unit: 'count', minimum: 10 },
  { key: 'customersAtRisk', group: 'customers', question: 'How many customers were at risk over the past 12 months?', label: 'At-risk customers', unit: 'count', minimum: 0, hint: 'Customers who wanted to leave. Enter 0 if there were none.' },
  { key: 'customersSaved', group: 'customers', question: 'How many at-risk customers were saved over the past 12 months?', label: 'Customers saved', unit: 'count', minimum: 0, hint: 'At-risk customers who stayed. Enter 0 if there were none.' },
  {
    key: 'costPerSale', group: 'perSale', question: 'What does it cost you to deliver your product or service?', label: 'Cost per sale', unit: 'money', minimum: 0, isOptional: true,
    hint: 'The direct cost of one product sold or one service delivered, on average: materials, stock, or the time and tools a job takes. Not your total business expenses.',
  },
  {
    key: 'profitPerSale', group: 'perSale', question: 'How much profit do you make per product or service sold?', label: 'Profit per sale', unit: 'money', minimum: 0, isOptional: true, allowNegative: true,
    hint: 'What you charge for one sale, minus its direct cost, on average. If you lose money on each sale, start with a minus sign.',
  },
];

export const findField = (key: AnswerKey) => ANSWER_FIELDS.find((field) => field.key === key) as AnswerFieldDefinition;

/** The groups only the Extended questionnaire asks */
export const EXTENDED_GROUPS: AnswerGroup[] = ['customers', 'perSale'];

/** The keys behind each core money question: the amount, the comparison and the earlier amount */
export const TREND_KEYS = {
  revenue: { amount: 'revenue', previous: 'previousRevenue', trend: 'revenueTrend', estimate: 'revenueIsEstimate' },
  expenses: { amount: 'expenses', previous: 'previousExpenses', trend: 'expensesTrend', estimate: 'expensesIsEstimate' },
} as const;

export function getTrendOptions(subject: TrendSubject): { id: TrendChoice; label: string }[] {
  return [
    { id: 'exact', label: 'I know the exact amount' },
    { id: 'increased', label: `My ${subject} increased` },
    { id: 'decreased', label: `My ${subject} decreased` },
    { id: 'same', label: `My ${subject} stayed roughly the same` },
    { id: 'unsure', label: 'I\'m not sure' },
  ];
}

export const DEMO_ANSWERS: BusinessAnswers = {
  currency: 'USD',
  revenue: 2400000, revenueIsEstimate: false, revenueTrend: 'exact', previousRevenue: 2150000,
  expenses: 1850000, expensesIsEstimate: false, expensesTrend: 'increased', previousExpenses: null,
  customersLost: 180, customersRetained: 1620, customersAtRisk: 320, customersSaved: 140,
  costPerSale: 3.2, profitPerSale: 2.3,
};

const WHOLE_NUMBER = /^\d+$/;
const DECIMAL_NUMBER = /^\d+(\.\d+)?$/;
const SIGNED_DECIMAL_NUMBER = /^-?\d+(\.\d+)?$/;

/** Drops anything that cannot be part of a number as the user types. A minus sign may only lead. */
export function keepNumericCharacters(field: AnswerFieldDefinition, text: string): string {
  if (field.allowNegative) return text.replace(/[^\d.,-]/g, '').replace(/(?!^)-/g, '');
  return text.replace(field.unit === 'money' ? /[^\d.,]/g : /[^\d,]/g, '');
}

const stripSeparators = (text: string) => text.trim().replace(/,/g, '');

const formatAmount = (amount: number) => amount.toLocaleString('en-US', { maximumFractionDigits: 2 });

function getNumberPattern(field: AnswerFieldDefinition): RegExp {
  if (field.allowNegative) return SIGNED_DECIMAL_NUMBER;
  return field.unit === 'money' ? DECIMAL_NUMBER : WHOLE_NUMBER;
}

function getFieldError(field: AnswerFieldDefinition, text: string): string | undefined {
  const digits = stripSeparators(text);
  if (!digits) return field.isOptional ? undefined : 'Enter a number to continue.';
  if (!getNumberPattern(field).test(digits)) return 'Enter numbers only, for example 12500.';
  if (!field.allowNegative && Number(digits) < field.minimum) return `Enter at least ${formatWholeNumber(field.minimum)}.`;
  return undefined;
}

/** The number boxes that count for this mode and these choices. An earlier amount is asked only after "I know the exact amount". */
function getAskedFields(choices: AnswerChoices, mode: DashboardMode): AnswerFieldDefinition[] {
  return ANSWER_FIELDS.filter((field) => {
    if (field.key === 'previousRevenue') return choices.revenueTrend === 'exact';
    if (field.key === 'previousExpenses') return choices.expensesTrend === 'exact';
    return mode === 'extended' || !EXTENDED_GROUPS.includes(field.group);
  });
}

export function getDraftErrors(draft: AnswerDraft, choices: AnswerChoices, mode: DashboardMode): AnswerErrors {
  const errors: AnswerErrors = {};
  getAskedFields(choices, mode).forEach((field) => {
    const error = getFieldError(field, draft[field.key]);
    if (error) errors[field.key] = error;
  });
  if (!choices.revenueTrend) errors.revenueTrend = 'Choose the answer that fits best.';
  if (!choices.expensesTrend) errors.expensesTrend = 'Choose the answer that fits best.';
  if (mode === 'extended' && !Object.keys(errors).length) {
    addCustomerConsistencyErrors(draft, errors);
    addPerSaleConsistencyErrors(draft, errors);
  }
  return errors;
}

const readNumber = (draft: AnswerDraft, key: AnswerKey) => Number(stripSeparators(draft[key]));

/** Each answer can be fine alone while the customer numbers together are impossible. */
function addCustomerConsistencyErrors(draft: AnswerDraft, errors: AnswerErrors) {
  const retained = readNumber(draft, 'customersRetained');
  const totalCustomers = readNumber(draft, 'customersLost') + retained;
  const atRisk = readNumber(draft, 'customersAtRisk');
  const saved = readNumber(draft, 'customersSaved');

  if (atRisk > totalCustomers) errors.customersAtRisk = `This cannot be more than your ${formatWholeNumber(totalCustomers)} total customers (lost + retained).`;
  if (saved > atRisk) errors.customersSaved = `This cannot be more than the ${formatWholeNumber(atRisk)} at-risk customers.`;
  else if (saved > retained) errors.customersSaved = `Saved customers stayed, so this cannot be more than the ${formatWholeNumber(retained)} retained.`;
}

/** One sale is part of the year, so it cannot cost or bring in more than the whole year did. */
function addPerSaleConsistencyErrors(draft: AnswerDraft, errors: AnswerErrors) {
  const hasCost = stripSeparators(draft.costPerSale) !== '';
  const hasProfit = stripSeparators(draft.profitPerSale) !== '';
  const cost = readNumber(draft, 'costPerSale');
  const expenses = readNumber(draft, 'expenses');
  const revenue = readNumber(draft, 'revenue');

  if (hasCost && cost > expenses) errors.costPerSale = `This cannot be more than your total expenses of ${formatAmount(expenses)}.`;
  if (!hasCost || !hasProfit) return;
  const price = cost + readNumber(draft, 'profitPerSale');
  if (price < 0) errors.profitPerSale = `Cost + profit is the price of one sale, so a loss cannot be bigger than the ${formatAmount(cost)} cost.`;
  else if (price > revenue) errors.profitPerSale = `Cost + profit (${formatAmount(price)}) cannot be more than your total revenue of ${formatAmount(revenue)}.`;
}

/**
 * Returns complete answers, or null while anything asked is missing or invalid.
 * Questions not asked in this mode, and skipped optional ones, become null.
 */
export function parseDraft(draft: AnswerDraft, choices: AnswerChoices, currency: Currency, mode: DashboardMode): BusinessAnswers | null {
  if (Object.keys(getDraftErrors(draft, choices, mode)).length || !choices.revenueTrend || !choices.expensesTrend) return null;
  const isExtended = mode === 'extended';
  const readAsked = (key: AnswerKey, isAsked: boolean) => (isAsked && stripSeparators(draft[key]) !== '' ? readNumber(draft, key) : null);
  return {
    currency,
    revenue: readNumber(draft, 'revenue'),
    revenueIsEstimate: choices.revenueIsEstimate,
    revenueTrend: choices.revenueTrend,
    previousRevenue: readAsked('previousRevenue', choices.revenueTrend === 'exact'),
    expenses: readNumber(draft, 'expenses'),
    expensesIsEstimate: choices.expensesIsEstimate,
    expensesTrend: choices.expensesTrend,
    previousExpenses: readAsked('previousExpenses', choices.expensesTrend === 'exact'),
    customersLost: readAsked('customersLost', isExtended),
    customersRetained: readAsked('customersRetained', isExtended),
    customersAtRisk: readAsked('customersAtRisk', isExtended),
    customersSaved: readAsked('customersSaved', isExtended),
    costPerSale: readAsked('costPerSale', isExtended),
    profitPerSale: readAsked('profitPerSale', isExtended),
  };
}

/** Questions without an answer yet become blank fields, never zero. */
export function answersToDraft(answers: Partial<BusinessAnswers> | null): AnswerDraft {
  const keys = ANSWER_FIELDS.map((field) => field.key);
  return Object.fromEntries(keys.map((key) => [key, String(answers?.[key] ?? '')])) as AnswerDraft;
}

export const answersToChoices = (answers: Partial<BusinessAnswers> | null): AnswerChoices => ({
  revenueTrend: answers?.revenueTrend ?? null,
  expensesTrend: answers?.expensesTrend ?? null,
  revenueIsEstimate: answers?.revenueIsEstimate ?? false,
  expensesIsEstimate: answers?.expensesIsEstimate ?? false,
});

const TREND_CHOICES: TrendChoice[] = ['exact', 'increased', 'decreased', 'same', 'unsure'];
const readTrend = (candidate: unknown): TrendChoice => (TREND_CHOICES.includes(candidate as TrendChoice) ? candidate as TrendChoice : 'unsure');

/**
 * Reads stored answers. Saves from before the comparison questions count as "not sure", which shows no trend.
 * Returns null when anything required for the mode is missing or invalid.
 */
export function readSavedAnswers(candidate: unknown, mode: DashboardMode): BusinessAnswers | null {
  const answers = candidate as Partial<BusinessAnswers> | null;
  if (!answers || (answers.currency !== 'USD' && answers.currency !== 'ILS')) return null;
  const choices: AnswerChoices = {
    ...answersToChoices(answers),
    revenueTrend: readTrend(answers.revenueTrend),
    expensesTrend: readTrend(answers.expensesTrend),
  };
  return parseDraft(answersToDraft(answers), choices, answers.currency, mode);
}
