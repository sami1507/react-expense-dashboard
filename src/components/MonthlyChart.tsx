import { formatCents, formatMonth } from "../lib/format";
import type { MonthlyTotal } from "../lib/analytics";

interface MonthlyChartProps {
  totals: MonthlyTotal[];
}

const WIDTH = 640;
const HEIGHT = 260;
const PADDING = { top: 16, right: 16, bottom: 36, left: 16 };

/** Grouped bar chart of income and spending per month, drawn with plain SVG. */
export function MonthlyChart({ totals }: MonthlyChartProps) {
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const baseline = PADDING.top + plotHeight;
  const largest = Math.max(1, ...totals.flatMap((total) => [total.incomeCents, total.expenseCents]));
  const groupWidth = plotWidth / Math.max(1, totals.length);
  const barWidth = Math.min(28, groupWidth * 0.3);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Income and spending by month" className="chart">
      {totals.map((total, index) => {
        const centre = PADDING.left + index * groupWidth + groupWidth / 2;
        const incomeHeight = (total.incomeCents / largest) * plotHeight;
        const expenseHeight = (total.expenseCents / largest) * plotHeight;
        return (
          <g key={total.month}>
            <rect
              className="bar bar-income"
              x={centre - barWidth - 2}
              y={baseline - incomeHeight}
              width={barWidth}
              height={incomeHeight}
              rx={4}
            >
              <title>{`Income: ${formatCents(total.incomeCents)}`}</title>
            </rect>
            <rect
              className="bar bar-expense"
              x={centre + 2}
              y={baseline - expenseHeight}
              width={barWidth}
              height={expenseHeight}
              rx={4}
            >
              <title>{`Spending: ${formatCents(total.expenseCents)}`}</title>
            </rect>
            <text x={centre} y={HEIGHT - 12} textAnchor="middle" className="axis-label">
              {formatMonth(total.month)}
            </text>
          </g>
        );
      })}
      <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={baseline} y2={baseline} className="axis" />
    </svg>
  );
}
