import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import PageHeader from "../components/common/PageHeader.jsx";
import AssetTable from "../components/common/AssetTable.jsx";
import { Card, CardHeader } from "../components/ui/Card.jsx";
import Tabs from "../components/ui/Tabs.jsx";
import { EmptyState, ErrorState, LoadingState, DemoNotice } from "../components/ui/States.jsx";
import useAsync from "../hooks/useAsync.js";
import { getAssets } from "../services/api.js";
import { assetCategories } from "../data/mockData.js";

export default function Markets() {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState(["BTC", "NVDA"]);

  const { data, loading, error, reload } = useAsync(() => getAssets(category), [category]);

  const toggleFavorite = (symbol) =>
    setFavorites((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol],
    );

  const filtered = useMemo(() => {
    const list = data ?? [];
    const q = query.trim().toLowerCase();
    return list.filter(
      (a) =>
        (!onlyFavorites || favorites.includes(a.symbol)) &&
        (!q || a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)),
    );
  }, [data, query, onlyFavorites, favorites]);

  return (
    <>
      <PageHeader
        title="Markets"
        description="Discover stocks, crypto and futures available on Wealth Wallet."
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <Tabs items={assetCategories} value={category} onChange={setCategory} />
          <div className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search markets"
                className="focus-ring h-10 w-full rounded-lg border border-input bg-surface pl-9 pr-3 text-sm placeholder:text-muted-foreground/70"
              />
            </div>
            <button
              onClick={() => setOnlyFavorites((v) => !v)}
              aria-pressed={onlyFavorites}
              className={`focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border ${
                onlyFavorites ? "bg-accent text-gold" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Show watchlist only"
            >
              <Star className={onlyFavorites ? "h-4 w-4 fill-gold" : "h-4 w-4"} />
            </button>
          </div>
        </div>

        {error ? (
          <ErrorState onRetry={reload} />
        ) : loading ? (
          <LoadingState rows={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No assets found"
            description="Try a different search term or category."
          />
        ) : (
          <AssetTable assets={filtered} favorites={favorites} onToggleFavorite={toggleFavorite} />
        )}
      </Card>

      <DemoNotice className="mt-4">
        Demo prices shown for interface development — not live market data.
      </DemoNotice>
    </>
  );
}
