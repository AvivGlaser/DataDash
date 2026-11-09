# DataDash

A front-end-only business dashboard built with React, TypeScript, CSS and Recharts. Answers stay in the browser (localStorage).

## Run it

```
npm install
npm run dev
```

`npm run build` type-checks and creates a production bundle in `dist/`.

## Adding data

The home page shows a demo with fictional data, always labelled as such. **Enter my data** opens six questions, all covering the past 12 months: revenue, expenses, customers lost, customers retained, at-risk customers and customers saved.

Answers can be changed on the dashboard after submitting, and the metrics update as you type.

## Currency

Answers can be entered in USD or ILS, and the dashboard can show either. The USD/ILS rate comes from [Frankfurter](https://frankfurter.dev) (European Central Bank rates). It is downloaded at most once a day and cached in the browser. Converted values always show the rate used.

## How metrics are calculated

| Metric | Formula |
|---|---|
| Net Profit | Revenue - Expenses |
| Net Profit Margin | (Net Profit / Revenue) × 100 |
| Total customers | Customers lost + Customers retained |
| Customer Churn Rate | (Customers lost / Total customers) × 100 |
| Customer Retention Rate | (Customers retained / Total customers) × 100 |
| Save Rate | (Customers saved / At-risk customers) × 100 |

The wording lives in `src/utils/metricTerms.ts` and the calculations in `src/utils/metrics.ts`.

The earlier monthly dashboard is kept in `archive/monthly-dashboard-src` for reference and is not part of the build.
