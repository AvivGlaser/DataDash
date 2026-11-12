import type { OverviewProps } from '../../types';
import { buildCustomerRows } from '../../utils/chartData';
import { buildCustomerTable, buildFinancialTable } from '../../utils/chartTables';
import { formatPercent, formatWholeNumber } from '../../utils/format';
import { buildInsights } from '../../utils/insights';
import { buildCalculations } from '../../utils/metricCalculations';
import { calculateMetrics } from '../../utils/metrics';
import { buildRevenueSplit } from '../../utils/revenueSplit';
import { buildStatTiles } from '../../utils/statTiles';
import { buildTrendTiles } from '../../utils/trendTiles';
import { RevenueSplitChart } from '../charts/RevenueSplitChart';
import { ShareDonutChart } from '../charts/ShareDonutChart';
import { ChartCard } from '../common/ChartCard';
import { AnswersCard } from './AnswersCard';
import { BusinessHeader } from './BusinessHeader';
import { ExchangeRateNote } from './ExchangeRateNote';
import { HeroCard } from './HeroCard';
import { InsightsCard } from './InsightsCard';
import { StatTile } from './StatTile';
import { TrendTile } from './TrendTile';
import { UpgradeCard } from './UpgradeCard';

export function Overview({ answers, profile, mode, isSample, currency, isConversionUnavailable, rate, onAnswersChange, onProfileChange, onClearAnswers, onOpenQuestionnaire, onUpgrade }: OverviewProps) {
  const metrics = calculateMetrics(answers, currency, rate);
  const calculations = buildCalculations(metrics, answers, currency, rate);
  const customerRows = buildCustomerRows(metrics);
  const { customerTiles, atRiskTiles, perSaleTiles } = buildStatTiles(metrics, calculations, currency);
  const trendTiles = buildTrendTiles(metrics, calculations, currency);
  const insights = buildInsights(metrics, profile.category, currency);

  const editBusinessDetails = () => {
    const nameInput = document.getElementById('profile-businessName');
    nameInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    nameInput?.focus({ preventScroll: true });
  };

  return (
    <div className="overview">
      <BusinessHeader profile={profile} isSample={isSample} onEdit={isSample ? onOpenQuestionnaire : editBusinessDetails} />

      <div className="filter-row">
        <span className="period-chip">Past 12 months</span>
        <span className="filter-note">All amounts in {currency}</span>
        <ExchangeRateNote enteredCurrency={answers.currency} currency={currency} rate={rate} isConversionUnavailable={isConversionUnavailable} />
      </div>

      <section className="dash-section" aria-labelledby="section-money">
        <h2 className="section-title" id="section-money">Money</h2>
        <div className="dash-grid money-grid">
          <HeroCard metrics={metrics} answers={answers} currency={currency} rate={rate} />
          <ChartCard
            className="area-chart"
            title="Where your revenue goes"
            subtitle={`Past 12 months, in ${currency}`}
            table={buildFinancialTable(metrics, currency)}
          >
            <RevenueSplitChart split={buildRevenueSplit(metrics, currency)} />
          </ChartCard>
        </div>
      </section>

      <section className="dash-section" aria-labelledby="section-trend">
        <h2 className="section-title" id="section-trend">Compared with the year before</h2>
        <div className="dash-grid trend-grid">
          {trendTiles.map((tile) => <TrendTile key={tile.id} tile={tile} />)}
        </div>
      </section>

      <section className="dash-section" aria-labelledby="section-insights">
        <h2 className="section-title" id="section-insights">What this means for you</h2>
        <InsightsCard insights={insights} />
      </section>

      {mode === 'instant' && !isSample && (
        <div className="dash-section">
          <UpgradeCard onUpgrade={onUpgrade} />
        </div>
      )}

      {metrics.hasCustomerData && (
        <section className="dash-section" aria-labelledby="section-customers">
          <h2 className="section-title" id="section-customers">Customers</h2>
          <div className="dash-grid customers-grid">
            {customerTiles.map((tile) => <StatTile key={tile.id} tile={tile} />)}
            <ChartCard
              className="area-donut"
              title="Customers retained and lost"
              subtitle={`${formatWholeNumber(metrics.totalCustomers)} total customers`}
              legend={customerRows.map((row) => ({ name: row.name, color: row.color }))}
              table={buildCustomerTable(metrics)}
            >
              <ShareDonutChart
                rows={customerRows}
                format={formatWholeNumber}
                centerValue={formatPercent(metrics.retentionRate)}
                centerLabel="retained"
                height={550}
                ariaLabel={`${formatPercent(metrics.retentionRate)} of customers retained, ${formatPercent(metrics.churnRate)} lost`}
              />
            </ChartCard>
          </div>
        </section>
      )}
      {metrics.hasCustomerData && (
        <section className="dash-section" aria-labelledby="section-at-risk">
          <h2 className="section-title" id="section-at-risk">Customers at risk</h2>
          <div className="dash-grid saves-grid">
            {atRiskTiles.map((tile) => <StatTile key={tile.id} tile={tile} />)}
          </div>
        </section>
      )}

      {perSaleTiles.length > 0 && (
        <section className="dash-section" aria-labelledby="section-per-sale">
          <h2 className="section-title" id="section-per-sale">Per sale</h2>
          <div className="dash-grid per-sale-grid">
            {perSaleTiles.map((tile) => <StatTile key={tile.id} tile={tile} />)}
          </div>
        </section>
      )}

      {!isSample && (
        <div className="dash-section">
          <AnswersCard key={mode} answers={answers} mode={mode} profile={profile} onChange={onAnswersChange} onProfileChange={onProfileChange} onClear={onClearAnswers} />
        </div>
      )}
    </div>
  );
}
