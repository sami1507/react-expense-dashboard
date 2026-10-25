import type { Transaction } from "../types";

const HEADER = ["Date", "Description", "Category", "Amount"];

// Cells that start with these characters are evaluated as formulas by spreadsheet apps.
const FORMULA_START = /^[=+\-@\t\r]/;

/** Serialises transactions as RFC 4180 CSV that opens cleanly in spreadsheet apps. */
export function toCsv(transactions: readonly Transaction[]): string {
  const rows = transactions.map((transaction) => [
    neutraliseFormula(transaction.date),
    neutraliseFormula(transaction.description),
    neutraliseFormula(transaction.category),
    (transaction.amountCents / 100).toFixed(2),
  ]);
  return [HEADER, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n") + "\r\n";
}

function neutraliseFormula(value: string): string {
  return FORMULA_START.test(value) ? `'${value}` : value;
}

function escapeCell(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}
