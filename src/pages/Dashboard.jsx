import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHeader from "../components/common/PageHeader.jsx";
import BalanceCard from "../components/common/BalanceCard.jsx";
import QuickActions from "../components/common/QuickActions.jsx";
import TransactionList from "../components/common/TransactionList.jsx";
import { AssetIcon } from "../components/common/AssetTable.jsx";
import { Card, CardBody, CardHeader } from "../components/ui/Card.jsx";
import Tabs from "../components/ui/Tabs.jsx";
import Button from "../components/ui/Button.jsx";
import Badge, { Delta } from "../components/ui/Badge.jsx";
import { AllocationBar, AreaChart, Sparkline } from "../components/ui/Chart.jsx";
import { LoadingState, ErrorState, DemoNotice } from "../components/ui/States.jsx";
import useAsync from "../hooks/useAsync.js";
import {
  getAllocation,
  getAssets,
  getEarnPositions,
  getPortfolio,
  getPortfolioSeries,
  getPositions,
  getTransactions,
} from "../services/api.js";
import { copyPositions } from "../data/mockData.js";
import { currency, cx, number, percent } from "../lib/format.js";

const ranges = ["1D", "1W", "1M", "1Y", "ALL"];

const marketTabs = [
  { id: "all", label: "All" },
  { id: "stocks", label: "Stocks" },
  { id: "crypto", label: "Crypto" },
  { id: "futures", label: "Futures" },
];

export default function Dashboard() {
  const [range, setRange] = useState("1M");
  const [marketTab, setMarketTab] = useState("all");
  const portfolioReq = useAsync(getPortfolio, []);
  const seriesReq = useAsync(() => getPortfolioSeries(range), [range]);
  const allocationReq = useAsync(getAllocation, []);
  const positionsReq = useAsync(getPositions, []);
  const txReq = useAsync(getTransactions, []);
  const earnReq = useAsync(getEarnPositions, []);
  const marketsReq = useAsync(() => getAssets("all"), []);

  if (portfolioReq.error) return <ErrorState onRetry={portfolioReq.reload} />;

  const p = portfolioReq.data;
  const series = seriesReq.data?.map((d) => d.v) ?? [];
  const up = (series.at(-1) ?? 0) >= (series[0] ?? 0);

  const highlights = marketsReq.data
    ? marketsReq.data
        .filter((a) => marketTab === "all" || a.category === marketTab)
        .slice()
        .sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
        .slice(0, marketTab === "all" ? 4 : 3)
    : [];

  return (
    <>
      <PageHeader
        title="Good day, Xential"
        description="Your Wealth Wallet overview across trading, earn and cards."
        actions={
          <>
            <Button as={Link} to="/wallet/deposit" size="sm">
              Deposit
            </Button>
            <Button as={Link} to="/trade" size="sm" variant="outline">
              Trade
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          {portfolioReq.loading || !p ? (
            <Card>
              <LoadingState rows={4} />
            </Card>
          ) : (
            <BalanceCard portfolio={p}>
              <div className="mt-6">
                <QuickActions />
              </div>
            </BalanceCard>
          )}

          <Card>
            <CardHeader title="Market highlights" />
            {marketsReq.loading ? (
              <LoadingState rows={3} />
            ) : (
              <>
                <div className="border-b border-border px-5 pt-4">
                  <Tabs items={marketTabs} value={marketTab} onChange={setMarketTab} size="sm" />
                </div>
                <ul>
                  {highlights.map((asset) => (
                    <li
                      key={asset.symbol}
                      className="flex items-center gap-3 border-b border-border px-5 py-3.5 last:border-0"
                    >
                      <AssetIcon symbol={asset.symbol} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{asset.symbol}</p>
                        <p className="truncate text-xs text-muted-foreground">{asset.name}</p>
                      </div>
                      <Sparkline
                        values={asset.spark}
                        positive={asset.change24h >= 0}
                        className="hidden h-7 w-16 sm:block"
                      />
                      <div className="shrink-0 text-right">
                        <p className="num text-sm font-semibold">{currency(asset.price)}</p>
                        <Delta value={asset.change24h} className="text-xs" />
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>

          <Card>
            <CardHeader
              title="Portfolio performance"
              subtitle="Demo data — not live account performance."
              action={<Tabs items={ranges} value={range} onChange={setRange} size="sm" />}
            />
            <CardBody className="pt-4">
              {seriesReq.loading ? (
                <div className="h-[220px] animate-pulse rounded-lg bg-muted/50" />
              ) : (
                <AreaChart values={series} positive={up} />
              )}
              {p && (
                <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 border-t border-border pt-4 text-sm">
                  <span className="text-muted-foreground">
                    Today <Delta value={p.todayChangePercent} className="ml-1.5" />
                  </span>
                  <span className="text-muted-foreground">
                    All time <Delta value={p.allTimeChangePercent} className="ml-1.5" />
                  </span>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Active positions"
              action={
                <Button as={Link} to="/trade" variant="ghost" size="sm">
                  View all <ArrowRight className="h-4 w-4" />
                </Button>
              }
            />
            {positionsReq.loading ? (
              <LoadingState />
            ) : (
              <ul>
                {positionsReq.data.slice(0, 4).map((pos) => (
                  <li
                    key={pos.id}
                    className="flex items-center gap-3 border-b border-border px-5 py-3.5 last:border-0"
                  >
                    <AssetIcon symbol={pos.symbol} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {pos.symbol}
                        <span className="ml-2 text-xs font-medium uppercase text-muted-foreground">
                          {pos.side}
                        </span>
                      </p>
                      <p className="num truncate text-xs text-muted-foreground">
                        {number(pos.quantity, 4)} @ {currency(pos.entryPrice)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="num text-sm font-semibold">
                        {currency(pos.markPrice * pos.quantity)}
                      </p>
                      <p
                        className={cx(
                          "num text-xs font-semibold",
                          pos.pnl >= 0 ? "text-positive" : "text-negative",
                        )}
                      >
                        {pos.pnl >= 0 ? "+" : ""}
                        {currency(pos.pnl)} ({percent(pos.pnlPercent)})
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader
              title="Recent transactions"
              action={
                <Button as={Link} to="/transactions" variant="ghost" size="sm">
                  View all <ArrowRight className="h-4 w-4" />
                </Button>
              }
            />
            {txReq.loading ? <LoadingState /> : <TransactionList transactions={txReq.data.slice(0, 5)} />}
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Asset allocation" />
            <CardBody>
              {allocationReq.loading ? (
                <LoadingState rows={2} className="p-0" />
              ) : (
                <>
                  <AllocationBar segments={allocationReq.data} />
                  <ul className="mt-5 space-y-3">
                    {allocationReq.data.map((a) => (
                      <li key={a.label} className="flex items-center gap-3">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: a.color }}
                        />
                        <span className="min-w-0 flex-1 truncate text-sm">{a.label}</span>
                        <span className="num text-sm text-muted-foreground">{a.percent}%</span>
                        <span className="num w-24 text-right text-sm font-semibold">
                          {currency(a.value, "USD", { maximumFractionDigits: 0 })}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Earn"
              subtitle="Up to 9.6% p.a. on eligible products."
              action={
                <Button as={Link} to="/earn" variant="ghost" size="sm">
                  Open
                </Button>
              }
            />
            <CardBody className="space-y-3">
              {earnReq.loading ? (
                <LoadingState rows={2} className="p-0" />
              ) : (
                earnReq.data.map((pos) => (
                  <div
                    key={pos.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3.5 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{pos.name}</p>
                      <p className="num text-xs text-muted-foreground">
                        {currency(pos.principal)} principal
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <Badge tone="positive">{number(pos.apy, 1)}% p.a.</Badge>
                      <p className="num mt-1 text-xs text-positive">+{currency(pos.accrued)}</p>
                    </div>
                  </div>
                ))
              )}
              <DemoNotice>Rates are variable and subject to eligibility. Capital at risk.</DemoNotice>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Copy trading"
              action={
                <Button as={Link} to="/copy-trading" variant="ghost" size="sm">
                  Explore
                </Button>
              }
            />
            <CardBody className="space-y-3">
              {copyPositions.map((cp) => (
                <div key={cp.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{cp.traderName}</p>
                    <p className="num text-xs text-muted-foreground">
                      {currency(cp.allocated)} allocated
                    </p>
                  </div>
                  <Delta value={cp.pnlPercent} />
                </div>
              ))}
              <DemoNotice>Past performance does not guarantee future results.</DemoNotice>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
