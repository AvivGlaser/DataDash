import type { CSSProperties, ReactNode } from 'react';
import type {
  BusinessModel, FieldDefinition, ForecastBaseline, MetricCalculation, MetricSummary, MetricTerm,
  MonthRecord, Targets,
} from './business';
import type { Dashboard, Theme, ViewName } from './dashboard';
import type { ChartRow } from './charts';
import type { GuidedFlow } from './guided';

export type IconName =
  | 'up' | 'down' | 'flat' | 'check' | 'alert' | 'clock' | 'plus' | 'arrowLeft'
  | 'download' | 'trash' | 'sun' | 'moon' | 'close' | 'table' | 'chart' | 'file';

export interface IconProps {
  name: IconName;
  size?: number;
}

export interface AnimatedNumberProps {
  value: number | null;
  format: (value: number | null) => string;
}

export interface ChangeInfo {
  text: string;
  direction: 'up' | 'down' | 'flat';
  isGood: boolean | null;
}

export interface ChangeIndicatorProps {
  change: ChangeInfo | null;
  comparisonLabel: string;
}

export interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

export interface LegendItem {
  name: string;
  color: string;
}

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  legend?: LegendItem[];
  table: TableData;
  calculation?: MetricCalculation;
  className?: string;
  children: ReactNode;
}

export interface MetricHelpProps {
  calculation: MetricCalculation;
}

export type TooltipPosition = Pick<CSSProperties, 'left' | 'top' | 'transform'>;

export interface StatTileData {
  id: string;
  metric: MetricTerm;
  calculation: MetricCalculation;
  value: number | null;
  format: (value: number | null) => string;
  change: ChangeInfo | null;
  sparklineValues: (number | null)[];
  /** Why the value cannot be shown. Only meaningful when value is null. */
  missingReason: string;
}

export interface StatTileProps {
  tile: StatTileData;
  comparisonLabel: string;
  onAddMonth: () => void;
}

export interface HeroCardProps {
  summary: MetricSummary;
  priorSummary: MetricSummary | null;
  comparisonLabel: string;
  isRecurring: boolean;
  rows: ChartRow[];
}

export interface HeroFactProps {
  calculation: MetricCalculation;
  label?: string;
  value: string;
  note: string;
}

export interface TargetsCardProps {
  summary: MetricSummary;
  targets: Targets;
  onSave: (targets: Targets) => void;
}

export interface ScenarioPlannerProps {
  lastRecord: MonthRecord;
  baseline: ForecastBaseline;
}

export interface TrendPromptProps {
  className: string;
  isRecurring: boolean;
  onAddMonth: () => void;
}

export interface OverviewProps {
  records: MonthRecord[];
  businessModel: BusinessModel | null;
  targets: Targets;
  onTargetsChange: (targets: Targets) => void;
  onAddMonth: () => void;
}

export interface EditableCellProps {
  record: MonthRecord;
  field: FieldDefinition;
  onSave: (record: MonthRecord) => void;
}

export interface DataViewProps {
  dashboard: Dashboard;
  onAddMonth: () => void;
}

export interface TermGlossaryProps {
  terms: MetricTerm[];
}

export interface NavbarProps {
  currentView: ViewName;
  isSample: boolean;
  theme: Theme;
  onNavigate: (view: ViewName) => void;
  onToggleTheme: () => void;
  onAddMonth: () => void;
}

export interface GuidedSetupProps {
  records: MonthRecord[];
  knownBusinessModel: BusinessModel | null;
  initialMonth?: string;
  onClose: () => void;
  onComplete: (record: MonthRecord, businessModel: BusinessModel) => void;
}

export interface GuidedAnswerProps {
  flow: GuidedFlow;
}
