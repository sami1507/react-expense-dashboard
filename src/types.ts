export const CATEGORIES = [
  "Income",
  "Housing",
  "Groceries",
  "Transport",
  "Dining",
  "Utilities",
  "Entertainment",
  "Health",
  "Shopping",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Transaction {
  id: string;
  /** Calendar date in ISO format, YYYY-MM-DD. */
  date: string;
  description: string;
  category: Category;
  /** Signed amount in cents. Income is positive and spending is negative. */
  amountCents: number;
}

export type SortKey = "date" | "description" | "category" | "amountCents";
export type SortDirection = "asc" | "desc";

export interface Filters {
  query: string;
  category: Category | "All";
}
