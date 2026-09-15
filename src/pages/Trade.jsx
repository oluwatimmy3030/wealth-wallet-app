import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/common/PageHeader.jsx";
import { AssetIcon } from "../components/common/AssetTable.jsx";
import { Card, CardBody, CardHeader } from "../components/ui/Card.jsx";
import Tabs from "../components/ui/Tabs.jsx";
import Button from "../components/ui/Button.jsx";
import Badge, { Delta, StatusBadge } from "../components/ui/Badge.jsx";
import { Field, Input, Select } from "../components/ui/Input.jsx";
import { AreaChart } from "../components/ui/Chart.jsx";
import { DemoNotice, EmptyState, LoadingState } from "../components/ui/States.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import useAsync from "../hooks/useAsync.js";
import { getAssets, getOrders, getPositions, placeOrder } from "../services/api.js";
import { portfolio } from "../data/mockData.js";
import { currency, cx, number, percent } from "../lib/format.js";

const intervals = ["15m", "1H", "4H", "1D"];

export default function Trade() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const assetsReq = useAsync(() => getAssets("all"), []);
  const positionsReq = useAsync(getPositions, []);
  const ordersReq = useAsync(getOrders, []);

  const [side, setSide] = useState("buy");
  const [orderType, setOrderType] = useState("market");
  const [quantity, setQuantity] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [interval, setInterval] = useState("1H");
  const [bottomTab, setBottomTab] = useState("positions");
  const [submitting, setSubmitting] = useState(false);

  const assets = assetsReq.data ?? [];
  const asset = useMemo(
    () => assets.find((a) => a.symbol === (symbol ?? "BTC")) ?? assets[0],
    [assets, symbol],
  );

  const price = orderType === "limit" && limitPrice ? Number(limitPrice) : (asset?.price ?? 0);
  const estimate = (Number(quantity) || 0) * price;
  const canSubmit = Number(quantity) > 0 && (orderType !== "limit" || Number(limitPrice) > 0);

  async function submit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // INTEGRATION POINT — connect the trading engine here.
      await placeOrder({
        symbol: asset.symbol,
        side,
        type: orderType,
        quantity: Number(quantity),
        price,
      });
      toast.push({
        tone: "success",
        title: "Order submitted (demo)",
        description: `${side === "buy" ? "Buy" : "Sell"} ${quantity} ${asset.symbol} — awaiting backend execution.`,
      });
      setQuantity("");
    } catch (err) {
      toast.push({ tone: "error", title: "Order failed", description: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  if (assetsReq.loading || !asset) {
    return (
      <Card>
        <LoadingState rows={6} />
      </Card>
    );
  }

  const up = asset.change24h >= 0;

  return (
    <>
      <PageHeader
        title="Trade"
        description="Stocks, crypto and futures. Orders route to the Wealth Wallet backend once connected."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Card>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border p-4 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <AssetIcon symbol={asset.symbol} size="lg" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-base font-semibold">{asset.symbol}</h2>
                    <Badge tone="neutral">{asset.category}</Badge>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{asset.name}</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="num text-lg font-semibold">{currency(asset.price)}</p>
                <Delta value={asset.change24h} />
              </div>
            </div>

            <CardBody className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Select
                  aria-label="Select asset"
                  value={asset.symbol}
                  onChange={(e) => navigate(`/trade/${e.target.value}`)}
                  className="w-full sm:w-56"
                >
                  {assets.map((a) => (
                    <option key={a.symbol} value={a.symbol}>
                      {a.symbol} — {a.name}
                    </option>
                  ))}
                </Select>
                <Tabs items={intervals} value={interval} onChange={setInterval} size="sm" />
              </div>
              <AreaChart values={asset.spark} positive={up} height={260} />
              <DemoNotice>Chart shows demo data — not live market pricing.</DemoNotice>
            </CardBody>
          </Card>

          <Card>
            <div className="border-b border-border p-4 sm:px-5">
              <Tabs
                items={[
                  { id: "positions", label: "Open positions" },
                  { id: "orders", label: "Orders" },
                ]}
                value={bottomTab}
                onChange={setBottomTab}
              />
            </div>

            {bottomTab === "positions" ? (
              positionsReq.loading ? (
                <LoadingState />
              ) : positionsReq.data.length === 0 ? (
                <EmptyState title="No open positions" description="Your positions will appear here." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <tr className="border-b border-border">
                        <th className="px-5 py-3 font-medium">Asset</th>
                        <th className="px-5 py-3 font-medium">Side</th>
                        <th className="px-5 py-3 text-right font-medium">Qty</th>
                        <th className="px-5 py-3 text-right font-medium">Entry</th>
                        <th className="px-5 py-3 text-right font-medium">Mark</th>
                        <th className="px-5 py-3 text-right font-medium">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positionsReq.data.map((p) => (
                        <tr key={p.id} className="border-b border-border last:border-0">
                          <td className="px-5 py-3 font-semibold">{p.symbol}</td>
                          <td className="px-5 py-3 capitalize text-muted-foreground">{p.side}</td>
                          <td className="num px-5 py-3 text-right">{number(p.quantity, 4)}</td>
                          <td className="num px-5 py-3 text-right">{currency(p.entryPrice)}</td>
                          <td className="num px-5 py-3 text-right">{currency(p.markPrice)}</td>
                          <td
                            className={cx(
                              "num px-5 py-3 text-right font-semibold",
                              p.pnl >= 0 ? "text-positive" : "text-negative",
                            )}
                          >
                            {currency(p.pnl)} ({percent(p.pnlPercent)})
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : ordersReq.loading ? (
              <LoadingState />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <tr className="border-b border-border">
                      <th className="px-5 py-3 font-medium">Order</th>
                      <th className="px-5 py-3 font-medium">Type</th>
                      <th className="px-5 py-3 text-right font-medium">Qty</th>
                      <th className="px-5 py-3 text-right font-medium">Price</th>
                      <th className="px-5 py-3 text-right font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersReq.data.map((o) => (
                      <tr key={o.id} className="border-b border-border last:border-0">
                        <td className="px-5 py-3">
                          <span className="font-semibold">{o.symbol}</span>{" "}
                          <span className="capitalize text-muted-foreground">{o.side}</span>
                        </td>
                        <td className="px-5 py-3 capitalize text-muted-foreground">{o.type}</td>
                        <td className="num px-5 py-3 text-right">{number(o.quantity, 4)}</td>
                        <td className="num px-5 py-3 text-right">{currency(o.price)}</td>
                        <td className="px-5 py-3 text-right">
                          <StatusBadge status={o.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <Card className="h-fit xl:sticky xl:top-20">
          <CardHeader title="Place order" subtitle={`Available ${currency(portfolio.availableBalance)}`} />
          <CardBody>
            <div className="grid grid-cols-2 gap-2">
              {["buy", "sell"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  className={cx(
                    "focus-ring h-10 rounded-lg text-sm font-semibold capitalize transition-colors",
                    side === s
                      ? s === "buy"
                        ? "bg-primary text-primary-foreground"
                        : "bg-destructive text-destructive-foreground"
                      : "border border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="mt-4 space-y-4">
              <Field label="Order type">
                <Select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                  <option value="market">Market</option>
                  <option value="limit">Limit</option>
                  <option value="stop">Stop</option>
                </Select>
              </Field>

              {orderType !== "market" && (
                <Field label="Price">
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    placeholder={String(asset.price)}
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    suffix="USD"
                  />
                </Field>
              )}

              <Field label="Quantity">
                <Input
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  suffix={asset.symbol}
                />
              </Field>

              <dl className="space-y-2 rounded-lg border border-border bg-surface p-3.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Price</dt>
                  <dd className="num font-medium">{currency(price)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Estimated value</dt>
                  <dd className="num font-medium">{currency(estimate)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Est. fee</dt>
                  <dd className="num font-medium">{currency(estimate * 0.001)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <dt className="font-medium">Total</dt>
                  <dd className="num font-semibold">{currency(estimate * 1.001)}</dd>
                </div>
              </dl>

              <Button
                type="submit"
                size="lg"
                variant={side === "buy" ? "primary" : "danger"}
                className="w-full"
                loading={submitting}
                disabled={!canSubmit}
              >
                {side === "buy" ? "Buy" : "Sell"} {asset.symbol}
              </Button>

              <DemoNotice>
                Orders are not executed. The trading backend is connected separately.
              </DemoNotice>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
