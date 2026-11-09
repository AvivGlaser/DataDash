import type { EditableCellProps } from '../../types';
import { formatMonthLabel } from '../../utils/format';
import { parseNumber } from '../../utils/parsing';

export function EditableCell({ record, field, onSave }: EditableCellProps) {
  const savedValue = record[field.key];

  const commitEdit = (input: HTMLInputElement) => {
    const typedValue = parseNumber(input.value);
    const isRejected = typedValue === null || typedValue < 0 || (typedValue === 0 && !field.isZeroAllowed);
    if (isRejected) input.value = String(savedValue);
    else if (typedValue !== savedValue) onSave({ ...record, [field.key]: field.isMoney ? typedValue : Math.round(typedValue) });
  };

  return (
    <td>
      <input
        key={savedValue}
        className="cell"
        inputMode="decimal"
        defaultValue={savedValue}
        aria-label={`${field.label}, ${formatMonthLabel(record.month)}`}
        onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur(); }}
        onBlur={(event) => commitEdit(event.target)}
      />
    </td>
  );
}
