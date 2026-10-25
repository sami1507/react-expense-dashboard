import { useMemo } from "react";
import { CategoryDonut } from "./components/CategoryDonut";
import { MonthlyChart } from "./components/MonthlyChart";
import { SummaryCards } from "./components/SummaryCards";
import { TransactionTable } from "./components/TransactionTable";
import { generateTransactions } from "./data/generateTransactions";
import { categoryTotals, monthlyTotals, summarize } from "./lib/analytics";

export function App() {
  const transactions = useMemo(() => generateTransactions(), []);
  const summary = useMemo(() => summarize(transactions), [transactions]);
  const monthly = useMemo(() => monthlyTotals(transactions), [transactions]);
  const categories = useMemo(() => categoryTotals(transactions), [transactions]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Expense dashboard</h1>
        <p className="muted">Six months of sample data, generated in the browser.</p>
      </header>

      <SummaryCards summary={summary} />

      <div className="grid">
        <section className="panel" aria-labelledby="monthly-heading">
          <h2 id="monthly-heading">Income vs spending</h2>
          <MonthlyChart totals={monthly} />
        </section>
        <section className="panel" aria-labelledby="category-heading">
          <h2 id="category-heading">Spending by category</h2>
          <CategoryDonut slices={categories} />
        </section>
      </div>

      <TransactionTable transactions={transactions} />
    </div>
  );
}
