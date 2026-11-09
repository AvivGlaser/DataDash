import type { MonthRecord } from '../types';
import { FIELDS } from './fields';

const COLUMN_KEYS = ['month', ...FIELDS.map((field) => field.key)] as (keyof MonthRecord)[];

export function exportRecords(records: MonthRecord[]) {
  const rows = records.map((record) => COLUMN_KEYS.map((key) => record[key]).join(','));
  const csvText = [COLUMN_KEYS.join(','), ...rows].join('\r\n');
  const blobUrl = URL.createObjectURL(new Blob([csvText], { type: 'text/csv;charset=utf-8' }));
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = 'datadash-export.csv';
  downloadLink.click();
  URL.revokeObjectURL(blobUrl);
}
