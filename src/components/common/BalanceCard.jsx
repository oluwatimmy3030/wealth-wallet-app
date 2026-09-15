import { useState } from "react";
import { Eye, EyeOff, TrendingDown, TrendingUp } from "lucide-react";
import { currency, percent } from "../../lib/format.js";

export default function BalanceCard({ portfolio, children }) {
  const [hidden, setHidden] = useState(false);
  const up = portfolio.todayChange >= 0;
  const Trend = up ? TrendingUp : TrendingDown;
  const mask = (v) => (hidden ? "••••••" : v);

  return (
    <section className="surface-card relative overflow-hidden p-5 sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Total portfolio value</p>
          <button
            onClick={() => setHidden((v) => !v)}
            aria-label={hidden ? "Show balances" : "Hide balances"}
            className="focus-ring rounded-sm text-muted-foreground hover:text-foreground"
          >
            {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <p className="num mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold sm:text-4xl">
          {mask(currency(portfolio.totalValue))}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
          <span className={up ? "text-positive" : "text-negative"}>
            <Trend className="mr-1 inline h-4 w-4" />
            <span className="num font-semibold">
              {mask(`${up ? "+" : ""}${currency(portfolio.todayChange)}`)}
            </span>{" "}
            <span className="num">({percent(portfolio.todayChangePercent)})</span>
          </span>
          <span className="text-muted-foreground">today</span>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5 sm:grid-cols-3">
          {[
            ["Available", portfolio.availableBalance],
            ["Invested", portfolio.investedValue],
            ["In Earn", portfolio.earnBalance],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
              <dd className="num mt-1 text-base font-semibold">{mask(currency(value))}</dd>
            </div>
          ))}
        </dl>

        {children}
      </div>
    </section>
  );
}
