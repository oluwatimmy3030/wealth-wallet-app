import { useId } from "react";
import { cx } from "../../lib/format.js";

const toPoints = (values, width, height, pad = 2) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = width / Math.max(values.length - 1, 1);
  return values.map((v, i) => [
    i * step,
    pad + (height - pad * 2) * (1 - (v - min) / span),
  ]);
};

/** Compact inline trend line. */
export function Sparkline({ values = [], positive = true, width = 96, height = 32, className }) {
  if (values.length < 2) return null;
  const pts = toPoints(values, width, height);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cx("h-8 w-24", className)}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={d}
        fill="none"
        stroke={positive ? "var(--color-positive)" : "var(--color-negative)"}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Responsive area chart used for portfolio and asset performance. */
export function AreaChart({ values = [], positive = true, height = 220, className }) {
  const gradientId = useId();
  if (values.length < 2) return null;
  const W = 600;
  const H = 200;
  const pts = toPoints(values, W, H, 6);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  const stroke = positive ? "var(--color-primary)" : "var(--color-negative)";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cx("w-full", className)}
      style={{ height }}
      preserveAspectRatio="none"
      role="img"
      aria-label="Performance chart (demo data)"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((p) => (
        <line
          key={p}
          x1="0"
          x2={W}
          y1={H * p}
          y2={H * p}
          stroke="var(--color-border)"
          strokeWidth="1"
        />
      ))}
      <path d={area} fill={`url(#${gradientId})`} />
      <path d={line} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

/** Horizontal allocation bar. */
export function AllocationBar({ segments = [] }) {
  const total = segments.reduce((sum, s) => sum + s.percent, 0) || 100;
  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
      {segments.map((s) => (
        <span
          key={s.label}
          title={s.label}
          style={{ width: `${(s.percent / total) * 100}%`, backgroundColor: s.color }}
        />
      ))}
    </div>
  );
}
