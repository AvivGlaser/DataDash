import type { TermGlossaryProps } from '../../types';

export function TermGlossary({ terms }: TermGlossaryProps) {
  return (
    <dl className="glossary">
      {terms.map((item) => (
        <div key={item.term}>
          <dt>{item.term}</dt>
          <dd className="term-note">{item.explanation}</dd>
        </div>
      ))}
    </dl>
  );
}
