import type { DataViewProps } from '../../types';
import { getFieldsForModel } from '../../utils/fields';
import { exportRecords } from '../../utils/fileExport';
import { formatMoney, formatMonthLabel, formatPercent, formatPercentTwoDecimals } from '../../utils/format';
import { METRIC_TERMS } from '../../utils/metricTerms';
import { findMissingMonths, getArr, getChurnRate, getRoi, hasInconsistentCustomers } from '../../utils/metrics';
import { Icon } from '../common/Icon';
import { EditableCell } from './EditableCell';
import { TermGlossary } from './TermGlossary';

const MAX_MONTHS_NAMED = 6;
const RECURRING_TERMS = [METRIC_TERMS.mrr, METRIC_TERMS.arr, METRIC_TERMS.cogs, METRIC_TERMS.churnRate, METRIC_TERMS.roi];
const ONE_TIME_TERMS = [METRIC_TERMS.cogs, METRIC_TERMS.roi];

const describeMonths = (months: string[]) =>
  months.slice(0, MAX_MONTHS_NAMED).map(formatMonthLabel).join(', ') +
  (months.length > MAX_MONTHS_NAMED ? ` and ${months.length - MAX_MONTHS_NAMED} more` : '');

export function DataView({ dashboard, onAddMonth }: DataViewProps) {
  const { records, isSample, businessModel } = dashboard;
  const isRecurring = businessModel !== 'oneTime';
  const fields = getFieldsForModel(businessModel);
  const missingMonths = findMissingMonths(records);
  const inconsistentMonths = isRecurring ? records.filter(hasInconsistentCustomers).map((record) => record.month) : [];
  const newestFirst = [...records].reverse();

  return (
    <div className="data-view">
      <section className="card">
        <header className="card-head wrap">
          <div>
            <h2>Monthly records</h2>
            <p>{records.length} {records.length === 1 ? 'month' : 'months'}{isSample ? ' of fictional demo data' : ''}. Click any number to edit it.</p>
          </div>
          <div className="row-gap wrap">
            <button className="btn primary small" onClick={onAddMonth}><Icon name="plus" size={14} />Add a month</button>
            <button className="btn ghost small" onClick={() => exportRecords(records)}><Icon name="download" size={14} />Export CSV</button>
            {!isSample && <button className="btn ghost small" onClick={dashboard.loadSampleData}>View demo</button>}
            {!isSample && <button className="btn ghost small danger" onClick={dashboard.clearRecords}><Icon name="trash" size={14} />Clear all</button>}
          </div>
        </header>

        {missingMonths.length > 0 && (
          <p className="notice">
            <Icon name="alert" size={14} /> Missing {missingMonths.length === 1 ? 'month' : 'months'}: {describeMonths(missingMonths)}. Charts join the months on either side of a gap.
          </p>
        )}
        {inconsistentMonths.length > 0 && (
          <p className="notice">
            <Icon name="alert" size={14} /> Check {describeMonths(inconsistentMonths)}: new customers exceed the month-end total, so churn for those months will be unreliable.
          </p>
        )}

        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                {fields.map((field) => <th key={field.key} title={field.hint}>{field.label}</th>)}
                {isRecurring && <th className="calc">ARR</th>}
                {isRecurring && <th className="calc">Churn</th>}
                <th className="calc">ROI</th>
                <th><span className="sr">Delete</span></th>
              </tr>
            </thead>
            <tbody>
              {newestFirst.map((record) => (
                <tr key={record.month}>
                  <th scope="row">{formatMonthLabel(record.month)}</th>
                  {fields.map((field) => <EditableCell key={field.key} record={record} field={field} onSave={dashboard.saveRecord} />)}
                  {isRecurring && <td className="calc">{formatMoney(getArr(record))}</td>}
                  {isRecurring && <td className="calc">{formatPercentTwoDecimals(getChurnRate(record))}</td>}
                  <td className="calc">{formatPercent(getRoi(record))}</td>
                  <td>
                    <button className="icon-btn subtle" onClick={() => dashboard.deleteRecord(record.month)} aria-label={`Delete ${formatMonthLabel(record.month)}`}>
                      <Icon name="trash" size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TermGlossary terms={isRecurring ? RECURRING_TERMS : ONE_TIME_TERMS} />
      </section>
    </div>
  );
}
