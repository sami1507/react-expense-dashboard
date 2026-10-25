import { useMemo, useState } from "react";
import { filterTransactions, sortTransactions } from "../lib/analytics";
import { formatCents } from "../lib/format";
import { toCsv } from "../lib/csv";
import { CATEGORIES, type Category, type Filters, type SortDirection, type SortKey, type Transaction } from "../types";

interface TransactionTableProps {
  transactions: Transaction[];
}

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "date", label: "Date" },
  { key: "description", label: "Description" },
  { key: "category", label: "Category" },
  { key: "amountCents", label: "Amount" },
];

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [filters, setFilters] = useState<Filters>({ query: "", category: "All" });
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const visible = useMemo(
    () => sortTransactions(filterTransactions(transactions, filters), sortKey, sortDirection),
    [transactions, filters, sortKey, sortDirection],
  );

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection(key === "date" || key === "amountCents" ? "desc" : "asc");
    }
  }

  return (
    <section className="panel" aria-labelledby="transactions-heading">
      <div className="panel-header">
        <h2 id="transactions-heading">Transactions</h2>
        <button type="button" onClick={() => downloadCsv("transactions.csv", toCsv(visible))}>
          Export CSV
        </button>
      </div>

      <div className="toolbar">
        <label>
          Search
          <input
            type="search"
            value={filters.query}
            placeholder="Description or category"
            onChange={(event) => setFilters({ ...filters, query: event.target.value })}
          />
        </label>
        <label>
          Category
          <select
            value={filters.category}
            onChange={(event) =>
              setFilters({ ...filters, category: event.target.value as Category | "All" })
            }
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="muted" aria-live="polite">
        Showing {visible.length} of {transactions.length} transactions
      </p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    sortKey === column.key ? (sortDirection === "asc" ? "ascending" : "descending") : "none"
                  }
                  className={column.key === "amountCents" ? "num" : undefined}
                >
                  <button type="button" className="sort-button" onClick={() => toggleSort(column.key)}>
                    {column.label}
                    {sortKey === column.key ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td>
                  <span className="tag">{transaction.category}</span>
                </td>
                <td className={`num ${transaction.amountCents < 0 ? "negative" : "positive"}`}>
                  {formatCents(transaction.amountCents)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <p className="empty">No transactions match these filters.</p>}
      </div>
    </section>
  );
}
