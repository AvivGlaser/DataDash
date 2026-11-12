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
  chevronDown: <path d="M6 9l6 6 6-6" />,
  pencil: <><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></>,
  cup: <><path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" /><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16" /><path d="M8.5 3.5v2.5M12.5 3.5v2.5" /></>,
  bag: <><path d="M5 8h14l-1.2 12H6.2z" /><path d="M9 10V6.5a3 3 0 0 1 6 0V10" /></>,
  briefcase: <><rect x="3.5" y="7.5" width="17" height="12" rx="2" /><path d="M9 7.5V5.5h6v2M3.5 12.5h17" /></>,
  heartPulse: <><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" /><path d="M7.5 12.5h2.5l1.5-2.5 2 4 1.2-1.5h1.8" /></>,
  laptop: <><rect x="5" y="5" width="14" height="10" rx="1.5" /><path d="M2.5 19h19" /></>,
  moneyBag: <><path d="M9 3.5h6l-2 3.5h-2z" /><path d="M10.2 7.2C6.5 9 4.5 12.5 4.5 15.5c0 3 2.8 5 7.5 5s7.5-2 7.5-5c0-3-2-6.5-5.7-8.3" /><path d="M9.5 14.5h5M12 12v5" /></>,
  trendUp: <><path d="M3.5 17l6-6 4 4 7-7.5" /><path d="M15 7.5h5.5V13" /></>,
  trendDown: <><path d="M3.5 7l6 6 4-4 7 7.5" /><path d="M15 16.5h5.5V11" /></>,
  receipt: <><path d="M6 3.5h12v17l-2.5-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 20.5z" /><path d="M9 8h6M9 11.5h6M9 15h3.5" /></>,
  percent: <><path d="M18.5 5.5l-13 13" /><circle cx="7" cy="7" r="2.5" /><circle cx="17" cy="17" r="2.5" /></>,
  repeat: <><path d="M17 3.5l3 3-3 3" /><path d="M4 11.5v-1a4 4 0 0 1 4-4h12" /><path d="M7 20.5l-3-3 3-3" /><path d="M20 12.5v1a4 4 0 0 1-4 4H4" /></>,
  userCheck: <><circle cx="9.5" cy="8" r="3.5" /><path d="M3 20c0-3.6 2.9-6 6.5-6 1.5 0 2.8.4 3.9 1.1" /><path d="M15.5 17.5l2 2 4-4" /></>,
  userMinus: <><circle cx="9.5" cy="8" r="3.5" /><path d="M3 20c0-3.6 2.9-6 6.5-6 1.5 0 2.8.4 3.9 1.1" /><path d="M16 17.5h5.5" /></>,
  userAlert: <><circle cx="9.5" cy="8" r="3.5" /><path d="M3 20c0-3.6 2.9-6 6.5-6 1.5 0 2.8.4 3.9 1.1" /><path d="M19 12.5v4M19 19.8v.2" /></>,
  lifebuoy: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.5" /><path d="M6 6l3.5 3.5M14.5 14.5L18 18M18 6l-3.5 3.5M9.5 14.5L6 18" /></>,
  shield: <><path d="M12 3.5l7 2.5v5.5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6z" /><path d="M8.8 12l2.2 2.2 4.2-4.4" /></>,
  box: <><path d="M12 3.5l8 4v9l-8 4-8-4v-9z" /><path d="M4 7.5l8 4 8-4M12 11.5v9" /></>,
  coin: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /></>,
  tag: <><path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.5 1.5 0 0 1 0 2.1l-6.2 6.2a1.5 1.5 0 0 1-2.1 0z" /><circle cx="8" cy="8" r="1.5" /></>,
  bolt: <path d="M13 2.5L4.5 13.5h6.5l-1 8 8.5-11h-6.5z" />,
  lightbulb: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z" /></>,
  sparkle: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M19 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" /></>,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  barChart: <><path d="M4 20h16" /><path d="M7 16v-4M12 16V6M17 16v-7" /></>,
  help: <><circle cx="12" cy="12" r="8.5" /><path d="M9.6 9.5a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2.2-2.4 3.5" /><path d="M12 17v.2" /></>,
  shapes: <><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="3.25" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="3.25" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" /></>,
};

export function Icon({ name, size = 16 }: IconProps) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_SHAPES[name]}
    </svg>
  );
}
