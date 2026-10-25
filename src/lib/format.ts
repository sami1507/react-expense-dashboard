const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** Formats a value in cents as dollars, e.g. -145000 becomes "-$1,450.00". */
export function formatCents(cents: number): string {
  return currency.format(cents / 100);
}

/** Turns "2026-05" into "May 2026". */
export function formatMonth(month: string): string {
  const [year, monthIndex] = month.split("-").map(Number);
  return new Date(Date.UTC(year, monthIndex - 1, 1)).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}
