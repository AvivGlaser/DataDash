import type {
  BusinessModelOption, GuidedAnswers, GuidedContext, GuidedNumberKey, GuidedQuestion, GuidedReviewRow, MonthRecord,
} from '../types';
import { addMonths, formatMoney, formatMonthLabel, formatWholeNumber, getCurrentMonth } from './format';
import { parseNumber } from './parsing';

export const BUSINESS_MODEL_OPTIONS: BusinessModelOption[] = [
  { value: 'subscription', label: 'Subscriptions only', description: 'Customers pay on a recurring schedule.' },
  { value: 'mixed', label: 'Subscriptions and one-time sales', description: 'Some recurring income, some single purchases.' },
  { value: 'oneTime', label: 'One-time sales only', description: 'Customers pay per purchase. Subscription metrics will not apply.' },
];

const readNumber = (answers: GuidedAnswers, key: GuidedNumberKey) => parseNumber(answers[key]) ?? 0;
const hasRecurring = ({ answers }: GuidedContext) => answers.businessModel !== 'oneTime';
const monthName = ({ answers }: GuidedContext) => (answers.month ? formatMonthLabel(answers.month) : 'this month');
const always = () => true;

const getStartingCustomers = (answers: GuidedAnswers) =>
  readNumber(answers, 'customers') - readNumber(answers, 'newCustomers') + readNumber(answers, 'churnedCustomers');

const findPreviousMonth = ({ answers, records }: GuidedContext): MonthRecord | undefined =>
  answers.month ? records.find((record) => record.month === addMonths(answers.month, -1)) : undefined;

const getTotalCosts = (answers: GuidedAnswers) =>
  readNumber(answers, 'cogs') + readNumber(answers, 'salesMarketing') + readNumber(answers, 'otherCosts');

function hasCustomerMismatch(context: GuidedContext): boolean {
  const previousMonth = findPreviousMonth(context);
  return !previousMonth || previousMonth.customers !== getStartingCustomers(context.answers);
}

/** Questions in asking order. A question only appears when isRelevant says it applies. */
export const GUIDED_QUESTIONS: GuidedQuestion[] = [
  {
    id: 'businessModel',
    kind: 'choice',
    isRelevant: (context) => !context.isBusinessModelKnown,
    getPrompt: () => 'How does your business earn money?',
    getHelp: () => 'This decides which questions matter and which metrics apply to you.',
  },
  {
    id: 'month',
    kind: 'month',
    isRelevant: always,
    getPrompt: () => 'Which month are these numbers for?',
    getHelp: () => 'Pick a finished month so that the totals are complete.',
  },
  {
    id: 'replaceMonth',
    kind: 'confirm',
    isRelevant: ({ answers, records }) => records.some((record) => record.month === answers.month),
    getPrompt: (context) => `You already saved numbers for ${monthName(context)}. Replace them?`,
    confirmLabel: 'Yes, replace them',
    correctLabel: 'Choose another month',
    correctionTarget: 'month',
  },
  {
    id: 'mrr',
    kind: 'number',
    answerKey: 'mrr',
    unit: 'money',
    isRelevant: hasRecurring,
    getPrompt: (context) => `What was your Monthly Recurring Revenue (MRR) at the end of ${monthName(context)}?`,
    getHelp: () => 'Add up every active subscription, as a monthly amount. Divide annual plans by 12 and leave out one-time fees.',
  },
  {
    id: 'revenue',
    kind: 'number',
    answerKey: 'revenue',
    unit: 'money',
    isRelevant: always,
    getPrompt: (context) => `How much revenue did you earn in total in ${monthName(context)}?`,
    getHelp: ({ answers }) => (answers.businessModel === 'mixed'
      ? 'Include both subscriptions and one-time sales.'
      : 'Everything you earned that month, before any costs.'),
    getQuickFill: ({ answers }) => (answers.businessModel === 'subscription' && answers.mrr
      ? { label: `Same as MRR (${formatMoney(readNumber(answers, 'mrr'))})`, value: answers.mrr }
      : null),
  },
  {
    id: 'customers',
    kind: 'number',
    answerKey: 'customers',
    unit: 'count',
    isRelevant: always,
    getPrompt: (context) => (hasRecurring(context)
      ? `How many paying customers did you have at the end of ${monthName(context)}?`
      : `How many customers bought from you in ${monthName(context)}?`),
  },
  {
    id: 'newCustomers',
    kind: 'number',
    answerKey: 'newCustomers',
    unit: 'count',
    isZeroAllowed: true,
    isRelevant: always,
    getPrompt: (context) => (hasRecurring(context)
      ? `How many of those customers joined during ${monthName(context)}?`
      : 'How many of those were first-time buyers?'),
    getHelp: () => 'Enter 0 if there were none.',
    check: ({ answers }) => (readNumber(answers, 'newCustomers') > readNumber(answers, 'customers')
      ? `This cannot be more than the ${formatWholeNumber(readNumber(answers, 'customers'))} customers you just entered.`
      : null),
  },
  {
    id: 'churnedCustomers',
    kind: 'number',
    answerKey: 'churnedCustomers',
    unit: 'count',
    isZeroAllowed: true,
    isRelevant: hasRecurring,
    getPrompt: (context) => `How many customers cancelled or left during ${monthName(context)}?`,
    getHelp: () => 'Enter 0 if nobody left.',
  },
  {
    id: 'customerCheck',
    kind: 'confirm',
    isRelevant: (context) => hasRecurring(context) && hasCustomerMismatch(context),
    getPrompt: (context) => {
      const startingCustomers = formatWholeNumber(getStartingCustomers(context.answers));
      const previousMonth = findPreviousMonth(context);
      return previousMonth
        ? `${formatMonthLabel(previousMonth.month)} ended with ${formatWholeNumber(previousMonth.customers)} customers, but these answers mean ${monthName(context)} started with ${startingCustomers}. Keep them?`
        : `Your answers mean you started ${monthName(context)} with ${startingCustomers} customers. Is that right?`;
    },
    getHelp: () => 'Churn is measured against this starting number, so it needs to be right.',
    confirmLabel: 'Yes, that is right',
    correctLabel: 'Correct my customer numbers',
    correctionTarget: 'customers',
  },
  {
    id: 'cogs',
    kind: 'number',
    answerKey: 'cogs',
    unit: 'money',
    isZeroAllowed: true,
    isRelevant: always,
    getPrompt: (context) => `What did it directly cost to deliver your product in ${monthName(context)}?`,
    getHelp: () => 'This is your Cost of Goods Sold (COGS): hosting, materials, payment fees and customer support.',
  },
  {
    id: 'cogsCheck',
    kind: 'confirm',
    isRelevant: ({ answers }) => answers.cogs !== '' && readNumber(answers, 'cogs') === 0,
    getPrompt: () => 'Did delivering your product really cost $0?',
    getHelp: () => 'A $0 cost means a 100% gross margin, which makes customer lifetime value look higher.',
    confirmLabel: 'Yes, it cost nothing',
    correctLabel: 'Enter the cost',
    correctionTarget: 'cogs',
  },
  {
    id: 'salesMarketing',
    kind: 'number',
    answerKey: 'salesMarketing',
    unit: 'money',
    isZeroAllowed: true,
    isRelevant: always,
    getPrompt: (context) => `How much did you spend on sales and marketing in ${monthName(context)}?`,
    getHelp: () => 'Include ads, commissions, and the pay of anyone whose job is winning customers.',
  },
  {
    id: 'salesCheck',
    kind: 'confirm',
    isRelevant: ({ answers }) => answers.salesMarketing !== '' && readNumber(answers, 'salesMarketing') === 0 && readNumber(answers, 'newCustomers') > 0,
    getPrompt: ({ answers }) => `You won ${formatWholeNumber(readNumber(answers, 'newCustomers'))} new customers with $0 of sales and marketing. Is that right?`,
    getHelp: () => 'If it is, the dashboard will leave out Customer Acquisition Cost rather than show a misleading $0.',
    confirmLabel: 'Yes, that is right',
    correctLabel: 'Enter the spend',
    correctionTarget: 'salesMarketing',
  },
  {
    id: 'otherCosts',
    kind: 'number',
    answerKey: 'otherCosts',
    unit: 'money',
    isZeroAllowed: true,
    isRelevant: always,
    getPrompt: (context) => `What were all your other costs in ${monthName(context)}?`,
    getHelp: () => 'Salaries, rent, software and anything else. Do not repeat the delivery or sales costs you already entered.',
    check: ({ answers }) => (getTotalCosts(answers) > 0
      ? null
      : 'All of your costs add up to $0, so return on investment cannot be calculated. Enter at least one cost.'),
  },
  {
    id: 'review',
    kind: 'review',
    isRelevant: always,
    getPrompt: (context) => `Do these numbers for ${monthName(context)} look right?`,
    getHelp: () => 'Every metric on your dashboard is calculated from these answers.',
  },
];

/** The most recent finished month not yet saved, working backwards once the latest is covered. */
export function getDefaultGuidedMonth(records: MonthRecord[]): string {
  const lastFinishedMonth = addMonths(getCurrentMonth(), -1);
  if (!records.length) return lastFinishedMonth;
  const nextMonth = addMonths(records[records.length - 1].month, 1);
  return nextMonth <= lastFinishedMonth ? nextMonth : addMonths(records[0].month, -1);
}

/** Returns what is wrong with the current answer, or an empty string when it can be accepted. */
export function getQuestionError(question: GuidedQuestion, context: GuidedContext): string {
  const { answers } = context;
  if (question.kind === 'choice' && !answers.businessModel) return 'Choose the option closest to your business.';
  if (question.kind === 'month') {
    if (!answers.month) return 'Choose a month.';
    if (answers.month > getCurrentMonth()) return 'This month has not happened yet. Choose a past month.';
  }
  if (question.kind === 'number' && question.answerKey) {
    const typedValue = parseNumber(answers[question.answerKey]);
    if (typedValue === null) return 'Enter a number to continue. If the answer is none, enter 0.';
    if (typedValue < 0) return 'This cannot be negative.';
    if (typedValue === 0 && !question.isZeroAllowed) return 'This needs to be more than 0, or the metrics built on it would be meaningless.';
    if (question.unit === 'count' && !Number.isInteger(typedValue)) return 'Enter a whole number.';
  }
  return question.check?.(context) ?? '';
}

export function buildRecordFromAnswers(answers: GuidedAnswers): MonthRecord {
  const isOneTime = answers.businessModel === 'oneTime';
  return {
    month: answers.month,
    mrr: isOneTime ? 0 : readNumber(answers, 'mrr'),
    revenue: readNumber(answers, 'revenue'),
    customers: readNumber(answers, 'customers'),
    newCustomers: readNumber(answers, 'newCustomers'),
    churnedCustomers: isOneTime ? 0 : readNumber(answers, 'churnedCustomers'),
    salesMarketing: readNumber(answers, 'salesMarketing'),
    cogs: readNumber(answers, 'cogs'),
    totalCosts: getTotalCosts(answers),
  };
}

export function buildReviewRows(context: GuidedContext): GuidedReviewRow[] {
  const { answers } = context;
  const moneyRow = (label: string, key: GuidedNumberKey): GuidedReviewRow => ({ label, value: formatMoney(readNumber(answers, key)), questionId: key as GuidedReviewRow['questionId'] });
  const countRow = (label: string, key: GuidedNumberKey): GuidedReviewRow => ({ label, value: formatWholeNumber(readNumber(answers, key)), questionId: key as GuidedReviewRow['questionId'] });
  const recurringOnly = (row: GuidedReviewRow) => (hasRecurring(context) ? [row] : []);

  return [
    ...recurringOnly(moneyRow('MRR', 'mrr')),
    moneyRow('Revenue', 'revenue'),
    countRow('Customers', 'customers'),
    countRow('New customers', 'newCustomers'),
    ...recurringOnly(countRow('Customers lost', 'churnedCustomers')),
    moneyRow('COGS', 'cogs'),
    moneyRow('Sales and marketing', 'salesMarketing'),
    moneyRow('Other costs', 'otherCosts'),
    { label: 'Total costs (added up for you)', value: formatMoney(getTotalCosts(answers)), questionId: null },
  ];
}
