import { useState } from 'react';
import type { ChartCardProps } from '../../types';
import { Icon } from './Icon';
import { MetricHelp } from './MetricHelp';

export function ChartCard({ title, subtitle, legend, table, calculation, className = '', children }: ChartCardProps) {
  const [isShowingTable, setIsShowingTable] = useState(false);
  const toggleLabel = isShowingTable ? `Show ${title} chart` : `Show ${title} table`;

  return (
    <section className={`card ${className}`}>
      <header className="card-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="row-gap">
          {calculation && <MetricHelp calculation={calculation} />}
          <button
            className="icon-btn"
            onClick={() => setIsShowingTable(!isShowingTable)}
            aria-pressed={isShowingTable}
            title={isShowingTable ? 'Show chart' : 'Show table'}
            aria-label={toggleLabel}
          >
            <Icon name={isShowingTable ? 'chart' : 'table'} />
          </button>
        </div>
      </header>

      {legend && !isShowingTable && (
        <ul className="legend">
          {legend.map((item) => (
            <li key={item.name}><i style={{ background: item.color }} />{item.name}</li>
          ))}
        </ul>
      )}

      {isShowingTable ? (
        <div className="mini-table">
          <table>
            <thead>
              <tr>{table.headers.map((header) => <th key={header}>{header}</th>)}</tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr key={row[0]}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : children}
    </section>
  );
}
