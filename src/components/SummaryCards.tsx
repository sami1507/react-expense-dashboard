import { formatCents, formatPercent } from "../lib/format";
import type { Summary } from "../lib/analytics";

interface SummaryCardsProps {
  summary: Summary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    { label: "Income", value: formatCents(summary.incomeCents), tone: "positive" },
    { label: "Spending", value: formatCents(summary.expenseCents), tone: "negative" },
    {
      label: "Net",
      value: formatCents(summary.netCents),
      tone: summary.netCents >= 0 ? "positive" : "negative",
    },
    {
      label: "Savings rate",
      value: summary.savingsRate === null ? "–" : formatPercent(summary.savingsRate),
      tone: "neutral",
    },
  ];

  return (
    <section className="summary" aria-label="Period totals">
      {cards.map((card) => (
        <article key={card.label} className={`card stat stat-${card.tone}`}>
          <h2>{card.label}</h2>
          <p data-testid={`stat-${card.label.toLowerCase().replace(" ", "-")}`}>{card.value}</p>
        </article>
      ))}
    </section>
  );
}
