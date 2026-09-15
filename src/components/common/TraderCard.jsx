import { Sparkline } from "../ui/Chart.jsx";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import { compact, cx, number } from "../../lib/format.js";

const riskTone = { Low: "positive", Medium: "gold", High: "negative" };

export default function TraderCard({ trader, onCopy, onView }) {
  return (
    <article className="surface-card flex flex-col p-5 transition-colors hover:border-primary/35">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold text-primary">
            {trader.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">{trader.name}</h3>
            <p className="truncate text-xs text-muted-foreground">
              {trader.handle} · {trader.style}
            </p>
          </div>
        </div>
        <Badge tone={riskTone[trader.risk]}>{trader.risk} risk</Badge>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">12-month return (historical)</p>
          <p
            className={cx(
              "num text-2xl font-semibold",
              trader.return12m >= 0 ? "text-positive" : "text-negative",
            )}
          >
            {trader.return12m >= 0 ? "+" : ""}
            {number(trader.return12m, 1)}%
          </p>
        </div>
        <Sparkline values={trader.spark} positive={trader.return12m >= 0} className="h-10 w-28" />
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 text-center">
        {[
          ["Win rate", `${trader.winRate}%`],
          ["Max DD", `${number(trader.maxDrawdown, 1)}%`],
          ["Copiers", compact(trader.copiers)],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{k}</dt>
            <dd className="num mt-0.5 text-sm font-semibold">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {trader.assets.map((a) => (
          <Badge key={a} tone="neutral">
            {a}
          </Badge>
        ))}
      </div>

      <div className="mt-5 flex gap-2">
        <Button size="sm" className="flex-1" onClick={() => onCopy(trader)}>
          Copy trader
        </Button>
        <Button size="sm" variant="outline" onClick={() => onView(trader)}>
          Details
        </Button>
      </div>
    </article>
  );
}
