import { cx } from "../../lib/format.js";

const tones = {
  neutral: "bg-secondary text-muted-foreground",
  positive: "bg-primary/12 text-primary",
  negative: "bg-destructive/15 text-destructive",
  gold: "bg-gold/15 text-gold",
  info: "bg-accent text-accent-foreground",
};

export default function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const tone =
    status === "Completed" || status === "Active"
      ? "positive"
      : status === "Pending"
        ? "gold"
        : status === "Failed"
          ? "negative"
          : "neutral";
  return <Badge tone={tone}>{status}</Badge>;
}

export function Delta({ value, className }) {
  const positive = Number(value) >= 0;
  return (
    <span
      className={cx(
        "num text-sm font-semibold",
        positive ? "text-positive" : "text-negative",
        className,
      )}
    >
      {positive ? "+" : ""}
      {Number(value).toFixed(2)}%
    </span>
  );
}
