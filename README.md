# react-expense-dashboard

[![CI](https://github.com/sami1507/react-expense-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/sami1507/react-expense-dashboard/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)

A personal finance dashboard built with React and TypeScript. It shows income, spending and savings for a period, charts the month-by-month trend and the category breakdown, and lets you search, filter, sort and export transactions to CSV.

The charts are hand-written SVG, so the app ships with no charting library. Money is stored as integer cents, which keeps totals exact.

## Live demo

**https://sami1507.github.io/react-expense-dashboard/**

The demo is deployed from `main` by the `Deploy live demo` workflow. It uses the generated sample data, so it runs with no backend.

## Features

- **Summary cards** for income, spending, net result and savings rate
- **Monthly bar chart** comparing income with spending for each month
- **Category donut** with a legend showing amount and share of total spending
- **Transaction table** with search, category filter and sortable columns (`aria-sort` is kept in sync)
- **CSV export** of whatever is currently visible, with spreadsheet formula injection neutralised
- **Deterministic sample data** generated in the browser, so every visitor sees the same history

## Architecture

```text
src/
  types.ts                    Transaction, Category and filter/sort types
  data/generateTransactions   Seeded PRNG that builds six months of realistic data
  lib/
    analytics.ts              Pure functions: summarize, monthlyTotals, categoryTotals,
                              filterTransactions, sortTransactions
    csv.ts                    RFC 4180 serialiser with formula neutralisation
    format.ts                 Currency, month and percentage formatting
  components/
    SummaryCards.tsx          Period totals
    MonthlyChart.tsx          SVG grouped bars
    CategoryDonut.tsx         SVG donut built from stroke-dasharray segments
    TransactionTable.tsx      Filter and sort state, table, CSV download
  App.tsx                     Composes the page from memoised data
```

Calculations live in `lib/` and have no React dependency, so they are tested directly. Components only handle presentation and local UI state.

### Design decisions

- **Integer cents everywhere.** Values are summed as integers and formatted at the edge, so there is no floating-point drift in totals.
- **Memoised derived data.** Summaries and chart inputs are computed once per dataset, and the table recomputes only when its filters or sort change.
- **Stable sorting.** Ties are broken by transaction id, so the table does not reshuffle rows that compare equal.
- **Accessible charts.** Each SVG has a `role="img"` label, and every bar carries a `<title>` with its exact value.

## Getting started

```bash
npm ci
npm run dev       # http://localhost:5173
```

## Scripts

| Command             | What it does                                       |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Vite dev server with hot module replacement        |
| `npm test`          | Vitest suite (jsdom + Testing Library)             |
| `npm run typecheck` | Strict TypeScript check                            |
| `npm run build`     | Type-check, then build the production bundle       |

## Tests

- `analytics.test.ts` covers totals, grouping, category ranking, filtering and sorting, including stable tie-breaks.
- `csv.test.ts` checks quoting, escaped quotes, CRLF line endings and formula neutralisation (for example `=HYPERLINK(...)` is written as text).
- `App.test.tsx` covers deterministic data generation and the user flows: filtering, searching, and toggling sort direction.

## Tech stack

React 19 · TypeScript (strict) · Vite · Vitest · Testing Library · SVG

## License

MIT. See [LICENSE](LICENSE).
