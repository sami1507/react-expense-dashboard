import { describe, expect, it } from "vitest";
import {
  categoryTotals,
  filterTransactions,
  monthlyTotals,
  sortTransactions,
  summarize,
} from "../lib/analytics";
import type { Transaction } from "../types";

const sample: Transaction[] = [
  { id: "1", date: "2026-05-01", description: "Salary", category: "Income", amountCents: 300_000 },
  { id: "2", date: "2026-05-03", description: "Rent", category: "Housing", amountCents: -120_000 },
  { id: "3", date: "2026-05-08", description: "Supermarket", category: "Groceries", amountCents: -4_000 },
  { id: "4", date: "2026-06-01", description: "Salary", category: "Income", amountCents: 300_000 },
  { id: "5", date: "2026-06-12", description: "Corner Grocers", category: "Groceries", amountCents: -6_000 },
];

describe("summarize", () => {
  it("totals income, spending and the savings rate", () => {
    expect(summarize(sample)).toEqual({
      incomeCents: 600_000,
      expenseCents: 130_000,
      netCents: 470_000,
      savingsRate: 470_000 / 600_000,
    });
  });

  it("has no savings rate when there is no income", () => {
    expect(summarize([sample[2]]).savingsRate).toBeNull();
  });
});

describe("monthlyTotals", () => {
  it("groups by month in ascending order", () => {
    expect(monthlyTotals(sample)).toEqual([
      { month: "2026-05", incomeCents: 300_000, expenseCents: 124_000 },
      { month: "2026-06", incomeCents: 300_000, expenseCents: 6_000 },
    ]);
  });
});

describe("categoryTotals", () => {
  it("lists spending only, largest category first", () => {
    expect(categoryTotals(sample)).toEqual([
      { category: "Housing", cents: 120_000 },
      { category: "Groceries", cents: 10_000 },
    ]);
  });
});

describe("filterTransactions", () => {
  it("matches the query case-insensitively against description and category", () => {
    expect(filterTransactions(sample, { query: "GROC", category: "All" }).map((t) => t.id)).toEqual([
      "3",
      "5",
    ]);
  });

  it("combines the query with a category filter", () => {
    const result = filterTransactions(sample, { query: "salary", category: "Groceries" });
    expect(result).toEqual([]);
  });

  it("returns everything for an empty query", () => {
    expect(filterTransactions(sample, { query: "  ", category: "All" })).toHaveLength(sample.length);
  });
});

describe("sortTransactions", () => {
  it("sorts by amount in both directions without mutating the input", () => {
    const original = [...sample];
    const ascending = sortTransactions(sample, "amountCents", "asc");

    expect(ascending[0].id).toBe("2");
    expect(sortTransactions(sample, "amountCents", "desc")[0].id).toBe("1");
    expect(sample).toEqual(original);
  });

  it("breaks ties by id so the order is stable", () => {
    const ordered = sortTransactions(sample, "category", "asc").map((t) => t.id);
    expect(ordered).toEqual(["3", "5", "2", "1", "4"]);
  });
});
