import { formatCents, formatPercent } from "../lib/format";
import type { CategoryTotal } from "../lib/analytics";

interface CategoryDonutProps {
  slices: CategoryTotal[];
}

const PALETTE = ["#4c6ef5", "#12b886", "#fab005", "#fa5252", "#be4bdb", "#15aabf", "#fd7e14", "#82c91e"];
const SIZE = 200;
const RADIUS = 70;
const STROKE = 26;

/** Donut chart of spending by category. Each segment is a dash on one circle. */
export function CategoryDonut({ slices }: CategoryDonutProps) {
  const total = slices.reduce((sum, slice) => sum + slice.cents, 0);
  const circumference = 2 * Math.PI * RADIUS;
  let offset = 0;

  return (
    <div className="donut">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Spending by category" className="chart">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" className="donut-track" strokeWidth={STROKE} />
        {slices.map((slice, index) => {
          const length = total === 0 ? 0 : (slice.cents / total) * circumference;
          const segment = (
            <circle
              key={slice.category}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={PALETTE[index % PALETTE.length]}
              strokeWidth={STROKE}
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          );
          offset += length;
          return segment;
        })}
      </svg>

      <ul className="legend">
        {slices.map((slice, index) => (
          <li key={slice.category}>
            <span className="swatch" style={{ background: PALETTE[index % PALETTE.length] }} aria-hidden="true" />
            <span className="legend-name">{slice.category}</span>
            <span className="legend-value">
              {formatCents(-slice.cents)} · {formatPercent(total === 0 ? 0 : slice.cents / total)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
