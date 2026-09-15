import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Sparkline } from "../ui/Chart.jsx";
import { compact, currency, cx, percent } from "../../lib/format.js";

export function AssetIcon({ symbol, size = "md" }) {
  return (
    <span
      className={cx(
        "grid shrink-0 place-items-center rounded-full bg-accent font-semibold text-primary",
        size === "lg" ? "h-11 w-11 text-sm" : "h-9 w-9 text-xs",
      )}
    >
      {symbol.slice(0, 3)}
    </span>
  );
}

export function AssetRow({ asset, isFavorite, onToggleFavorite }) {
  const up = asset.change24h >= 0;
  return (
    <li className="border-b border-border last:border-0">
      <div className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-elevated sm:px-5">
        <button
          onClick={() => onToggleFavorite?.(asset.symbol)}
          aria-label={isFavorite ? `Remove ${asset.symbol} from watchlist` : `Add ${asset.symbol} to watchlist`}
          className="focus-ring shrink-0 rounded-sm text-muted-foreground hover:text-gold"
        >
          <Star className={cx("h-4 w-4", isFavorite && "fill-gold text-gold")} />
        </button>

        <Link
          to={`/trade/${asset.symbol}`}
          className="flex min-w-0 flex-1 items-center gap-3 focus-ring rounded-md"
        >
          <AssetIcon symbol={asset.symbol} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{asset.symbol}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {asset.name}
              {asset.contract ? ` · ${asset.contract}` : ""}
            </span>
          </span>

          <span className="hidden w-28 shrink-0 md:block">
            <Sparkline values={asset.spark} positive={up} />
          </span>

          <span className="hidden w-28 shrink-0 text-right text-xs text-muted-foreground lg:block">
            Vol {compact(asset.volume)}
          </span>

          <span className="w-28 shrink-0 text-right sm:w-32">
            <span className="num block text-sm font-semibold">{currency(asset.price)}</span>
            <span
              className={cx("num block text-xs font-semibold", up ? "text-positive" : "text-negative")}
            >
              {percent(asset.change24h)}
            </span>
          </span>
        </Link>
      </div>
    </li>
  );
}

export default function AssetTable({ assets, favorites = [], onToggleFavorite }) {
  return (
    <ul>
      {assets.map((asset) => (
        <AssetRow
          key={asset.symbol}
          asset={asset}
          isFavorite={favorites.includes(asset.symbol)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </ul>
  );
}
