import type { Category, Transaction } from "../types";

export const DEFAULT_MONTHS = ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"];

interface RecurringItem {
  day: number;
  description: string;
  category: Category;
  cents: number;
}

interface VariableItem {
  description: string;
  category: Category;
  minCents: number;
  maxCents: number;
}

const RECURRING: RecurringItem[] = [
  { day: 1, description: "Salary", category: "Income", cents: 420_000 },
  { day: 3, description: "Rent", category: "Housing", cents: -145_000 },
  { day: 5, description: "Gym membership", category: "Health", cents: -4_500 },
  { day: 10, description: "Internet", category: "Utilities", cents: -6_000 },
  { day: 12, description: "Streaming subscription", category: "Entertainment", cents: -1_299 },
];

const VARIABLE: VariableItem[] = [
  { description: "Supermarket", category: "Groceries", minCents: 4_000, maxCents: 16_000 },
  { description: "Farmers market", category: "Groceries", minCents: 1_500, maxCents: 4_500 },
  { description: "Metro top-up", category: "Transport", minCents: 2_000, maxCents: 6_000 },
  { description: "Ride share", category: "Transport", minCents: 900, maxCents: 3_500 },
  { description: "Coffee shop", category: "Dining", minCents: 400, maxCents: 1_400 },
  { description: "Restaurant", category: "Dining", minCents: 2_500, maxCents: 9_000 },
  { description: "Cinema", category: "Entertainment", minCents: 1_800, maxCents: 4_000 },
  { description: "Pharmacy", category: "Health", minCents: 800, maxCents: 5_500 },
  { description: "Online order", category: "Shopping", minCents: 2_000, maxCents: 18_000 },
  { description: "Electricity bill", category: "Utilities", minCents: 7_000, maxCents: 11_000 },
];

/** Small deterministic PRNG (mulberry32), so the demo data is identical on every load. */
function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Generates a realistic month-by-month history: recurring bills plus random everyday spending. */
export function generateTransactions(
  seed = 20261025,
  months: readonly string[] = DEFAULT_MONTHS,
): Transaction[] {
  const random = createRandom(seed);
  const transactions: Transaction[] = [];

  const add = (month: string, day: number, description: string, category: Category, cents: number) => {
    transactions.push({
      id: `tx-${String(transactions.length + 1).padStart(4, "0")}`,
      date: `${month}-${String(day).padStart(2, "0")}`,
      description,
      category,
      amountCents: cents,
    });
  };

  for (const month of months) {
    for (const item of RECURRING) {
      add(month, item.day, item.description, item.category, item.cents);
    }

    const count = 12 + Math.floor(random() * 7);
    for (let index = 0; index < count; index += 1) {
      const item = VARIABLE[Math.floor(random() * VARIABLE.length)];
      const day = 1 + Math.floor(random() * 28);
      const spend = item.minCents + Math.round(random() * (item.maxCents - item.minCents));
      add(month, day, item.description, item.category, -spend);
    }
  }

  return transactions;
}
