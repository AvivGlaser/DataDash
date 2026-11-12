# DataDash

A front-end-only business dashboard built with React, TypeScript, CSS and Recharts. Answers stay in the browser (localStorage).

## Run it

```
npm install
npm run dev
```

`npm run build` type-checks and creates a production bundle in `dist/`.

The project uses Vite 7, with rollup pinned to 4.53.3 through `overrides` in `package.json`. Windows Smart App Control blocks the native build files of Vite 8 and of newer rollup releases, so check that `npm run dev` still starts before upgrading either.

## Adding data

The home page shows a demo with fictional data, always labelled as such. On a first visit, a welcome dialog over the demo offers two ways to start. **Enter my data** opens it again later.

- **Instant (6 questions):** business name, category, revenue, how revenue compares with the 12 months before, expenses, and how expenses compare. Revenue and expenses can be marked as rough estimates.
- **Extended (12 questions):** the same six, then customers lost, retained, at risk and saved, and the optional per-sale cost and profit.

The comparison questions accept an exact earlier amount, a direction (increased, decreased, about the same) or "I'm not sure". A percentage change is shown only when the earlier amount was entered; a direction is shown as words, never as an invented percentage. Every trend and insight is labelled as coming from exact numbers, the user's estimates, or the user's own impression.

An Instant dashboard can be upgraded at any time: only the six missing questions are asked, and the existing answers are kept.

Answers, including the business name and category, can be changed on the dashboard after submitting, and everything updates as you type. Data saved before a question existed still loads; the new answers start blank. Saves from before the two modes existed load as Extended.

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
| Price per sale | Cost per sale + Profit per sale (only when both are answered) |

The wording lives in `src/utils/metricTerms.ts` and the calculations in `src/utils/metrics.ts`.

The earlier monthly dashboard is kept in `archive/monthly-dashboard-src` for reference and is not part of the build.
