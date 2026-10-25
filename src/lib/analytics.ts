import type { Category, Filters, SortDirection, SortKey, Transaction } from "../types";

export interface Summary {
  incomeCents: number;
  expenseCents: number;
  netCents: number;
  /** Share of income that was kept, or null when there was no income. */
  savingsRate: number | null;
}

export interface MonthlyTotal {
  /** Month in YYYY-MM format. */
  month: string;
  incomeCents: number;
  expenseCents: number;
}

export interface CategoryTotal {
  category: Category;
  cents: number;
}

export function summarize(transactions: readonly Transaction[]): Summary {
  let incomeCents = 0;
  let expenseCents = 0;
  for (const transaction of transactions) {
    if (transaction.amountCents >= 0) {
      incomeCents += transaction.amountCents;
    } else {
      expenseCents -= transaction.amountCents;
    }
  }

  const netCents = incomeCents - expenseCents;
  return {
    incomeCents,
    expenseCents,
    netCents,
    savingsRate: incomeCents > 0 ? netCents / incomeCents : null,
  };
}

export function monthlyTotals(transactions: readonly Transaction[]): MonthlyTotal[] {
  const byMonth = new Map<string, MonthlyTotal>();
  for (const transaction of transactions) {
    const month = transaction.date.slice(0, 7);
    const entry = byMonth.get(month) ?? { month, incomeCents: 0, expenseCents: 0 };
    if (transaction.amountCents >= 0) {
      entry.incomeCents += transaction.amountCents;
    } else {
      entry.expenseCents -= transaction.amountCents;
    }
    byMonth.set(month, entry);
  }
  return [...byMonth.values()].sort((a, b) => a.month.localeCompare(b.month));
}

/** Spending per category, largest first. Income is excluded. */
export function categoryTotals(transactions: readonly Transaction[]): CategoryTotal[] {
  const totals = new Map<Category, number>();
  for (const transaction of transactions) {
    if (transaction.amountCents < 0) {
      totals.set(
        transaction.category,
        (totals.get(transaction.category) ?? 0) - transaction.amountCents,
      );
    }
  }
  return [...totals]
    .map(([category, cents]) => ({ category, cents }))
    .sort((a, b) => b.cents - a.cents || a.category.localeCompare(b.category));
}

/** Case-insensitive search over description and category, plus an optional category filter. */
export function filterTransactions(
  transactions: readonly Transaction[],
  { query, category }: Filters,
): Transaction[] {
  const needle = query.trim().toLowerCase();
  return transactions.filter((transaction) => {
    if (category !== "All" && transaction.category !== category) {
      return false;
    }
    if (needle === "") {
      return true;
    }
    return (
      transaction.description.toLowerCase().includes(needle) ||
      transaction.category.toLowerCase().includes(needle)
    );
  });
}

/** Returns a sorted copy. Ties fall back to the id so the order is stable. */
export function sortTransactions(
  transactions: readonly Transaction[],
  key: SortKey,
  direction: SortDirection,
): Transaction[] {
  const sign = direction === "asc" ? 1 : -1;
  return [...transactions].sort((a, b) => {
    const result =
      key === "amountCents"
        ? a.amountCents - b.amountCents
        : a[key].localeCompare(b[key]);
    return sign * result || a.id.localeCompare(b.id);
  });
}
