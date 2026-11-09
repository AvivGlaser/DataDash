import type { CSSProperties } from 'react';

/** Passes a value's character count to CSS, so long numbers can shrink to fit their card. */
export function getValueFitStyle(formattedValue: string): CSSProperties {
  return { '--value-length': formattedValue.length } as CSSProperties;
}
