import type { BasisTagProps, InsightBasis } from '../../types';

const BASIS_TEXT: Record<InsightBasis, { label: string; description: string }> = {
  exact: { label: 'Exact numbers', description: 'Worked out from the amounts you entered.' },
  estimate: { label: 'Your estimates', description: 'Worked out from amounts you marked as rough estimates.' },
  assessment: { label: 'Your impression', description: 'Based on how you described the change, not on amounts.' },
};

/** Says where a value comes from. Each kind has its own border style, so it never relies on color alone. */
export function BasisTag({ basis }: BasisTagProps) {
  const { label, description } = BASIS_TEXT[basis];
  return (
    <span className={`basis-tag basis-${basis}`} title={description}>
      {label}
      <span className="sr">. {description}</span>
    </span>
  );
}
