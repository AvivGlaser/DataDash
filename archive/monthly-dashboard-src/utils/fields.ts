import type { BusinessModel, FieldDefinition } from '../types';

export const FIELDS: FieldDefinition[] = [
  { key: 'mrr', label: 'MRR', hint: 'Monthly Recurring Revenue at month end', isMoney: true, isZeroAllowed: false, isRecurringOnly: true },
  { key: 'revenue', label: 'Revenue', hint: 'All revenue earned this month', isMoney: true, isZeroAllowed: false, isRecurringOnly: false },
  { key: 'customers', label: 'Customers', hint: 'Customers at month end', isMoney: false, isZeroAllowed: false, isRecurringOnly: false },
  { key: 'newCustomers', label: 'New', hint: 'Customers gained this month', isMoney: false, isZeroAllowed: true, isRecurringOnly: false },
  { key: 'churnedCustomers', label: 'Churned', hint: 'Customers lost this month', isMoney: false, isZeroAllowed: true, isRecurringOnly: true },
  { key: 'salesMarketing', label: 'Sales & marketing', hint: 'Spend on winning new customers', isMoney: true, isZeroAllowed: true, isRecurringOnly: false },
  { key: 'cogs', label: 'COGS', hint: 'Cost of Goods Sold: direct cost of delivering your product', isMoney: true, isZeroAllowed: true, isRecurringOnly: false },
  { key: 'totalCosts', label: 'Total costs', hint: 'All costs this month, including the two above', isMoney: true, isZeroAllowed: false, isRecurringOnly: false },
];

export const getFieldsForModel = (businessModel: BusinessModel | null) =>
  FIELDS.filter((field) => businessModel !== 'oneTime' || !field.isRecurringOnly);
