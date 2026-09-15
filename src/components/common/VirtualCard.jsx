import { LogoMark } from "../brand/Logo.jsx";
import { cx } from "../../lib/format.js";

export default function VirtualCard({ card, revealed = false, className }) {
  return (
    <div
      className={cx(
        "relative aspect-[1.586/1] w-full max-w-sm overflow-hidden rounded-xl border border-border p-5 text-left",
        card.frozen ? "opacity-70" : "",
        className,
      )}
      style={{
        background:
          "linear-gradient(145deg, oklch(26% 0.035 167) 0%, oklch(18% 0.02 165) 55%, oklch(22% 0.03 150) 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-primary/12 blur-2xl"
      />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <LogoMark size={30} />
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {card.brand}
          </span>
        </div>

        <div>
          <p className="num text-lg font-medium tracking-[0.18em]">
            {revealed ? `4821 9043 1177 ${card.last4}` : card.number}
          </p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Expiry</p>
              <p className="num text-sm font-medium">{card.expiry}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">CVV</p>
              <p className="num text-sm font-medium">{revealed ? "412" : card.cvv}</p>
            </div>
            <p className="truncate text-sm font-medium text-muted-foreground">{card.label}</p>
          </div>
        </div>
      </div>

      {card.frozen && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          Frozen
        </span>
      )}
    </div>
  );
}
