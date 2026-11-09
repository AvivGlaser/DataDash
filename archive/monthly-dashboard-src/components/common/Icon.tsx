import type { ReactNode } from 'react';
import type { IconName, IconProps } from '../../types';

const ICON_SHAPES: Record<IconName, ReactNode> = {
  up: <path d="M12 19V5M6 11l6-6 6 6" />,
  down: <path d="M12 5v14M6 13l6 6 6-6" />,
  flat: <path d="M5 12h14" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  alert: <><path d="M12 8v5" /><path d="M12 16.5v.5" /><path d="M10.3 4.2L2.8 17.5A2 2 0 0 0 4.5 20.5h15a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  download: <><path d="M12 4v12M7 11l5 5 5-5" /><path d="M4 20h16" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></>,
  moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  table: <><rect x="3.5" y="5" width="17" height="14" rx="2" /><path d="M3.5 10h17M9.5 10v9" /></>,
  chart: <path d="M4 18l5.5-6.5 4 3.5L20 7" />,
  file: <><path d="M6 3h8l5 5v13H6z" /><path d="M14 3v5h5" /></>,
};

export function Icon({ name, size = 16 }: IconProps) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_SHAPES[name]}
    </svg>
  );
}
