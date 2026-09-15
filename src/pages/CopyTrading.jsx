import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import PageHeader from "../components/common/PageHeader.jsx";
import TraderCard from "../components/common/TraderCard.jsx";
import { Card, CardBody, CardHeader } from "../components/ui/Card.jsx";
import Tabs from "../components/ui/Tabs.jsx";
import Button from "../components/ui/Button.jsx";
import Modal from "../components/ui/Modal.jsx";
import Badge, { Delta } from "../components/ui/Badge.jsx";
import { Field, Input, Select } from "../components/ui/Input.jsx";
import { AreaChart } from "../components/ui/Chart.jsx";
import { LoadingState, ErrorState, DemoNotice } from "../components/ui/States.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import useAsync from "../hooks/useAsync.js";
import { getTraders, startCopying } from "../services/api.js";
import { copyPositions } from "../data/mockData.js";
import { currency, number } from "../lib/format.js";

const filters = [
  { id: "all", label: "All traders" },
  { id: "Low", label: "Lower risk" },
  { id: "Medium", label: "Balanced" },
  { id: "High", label: "Higher risk" },
];

export default function CopyTrading() {
  const { data, loading, error, reload } = useAsync(getTraders, []);
  const toast = useToast();
  const [filter, setFilter] = useState("all");
  const [copyTarget, setCopyTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [amount, setAmount] = useState("");
  const [riskCap, setRiskCap] = useState("10");
  const [submitting, setSubmitting] = useState(false);

  const traders = useMemo(
    () => (data ?? []).filter((t) => filter === "all" || t.risk === filter),
    [data, filter],
  );

  async function confirmCopy(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await startCopying({ traderId: copyTarget.id, amount: Number(amount), riskCap: Number(riskCap) });
      toast.push({
        tone: "success",
        title: "Copy request submitted (demo)",
        description: `${copyTarget.name} — pending backend confirmation.`,
      });
      setCopyTarget(null);
      setAmount("");
    } catch (err) {
      toast.push({ tone: "error", title: "Couldn’t start copying", description: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Copy Trading"
        description="Copy experienced traders at the tap of a button. Historical figures are demo data and do not indicate future results."
        actions={<Tabs items={filters} value={filter} onChange={setFilter} size="sm" />}
      />

      <Card className="mb-4">
        <CardHeader title="Your copy allocations" subtitle="Capital at risk. Performance varies." />
        <CardBody className="grid gap-3 sm:grid-cols-2">
          {copyPositions.map((cp) => (
            <div key={cp.id} className="rounded-lg border border-border bg-surface p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <p className="truncate text-sm font-semibold">{cp.traderName}</p>
                <Delta value={cp.pnlPercent} />
              </div>
              <p className="num mt-2 text-sm text-muted-foreground">
                {currency(cp.allocated)} allocated · {currency(cp.pnl)} P&L
              </p>
            </div>
          ))}
        </CardBody>
      </Card>

      {error ? (
        <ErrorState onRetry={reload} />
      ) : loading ? (
        <Card>
          <LoadingState rows={4} />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {traders.map((t) => (
            <TraderCard key={t.id} trader={t} onCopy={setCopyTarget} onView={setViewTarget} />
          ))}
        </div>
      )}

      <p className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        Copy trading involves risk, including possible loss of capital. Figures shown are
        historical demo data and are not a promise of future performance.
      </p>

      <Modal
        open={Boolean(copyTarget)}
        onClose={() => setCopyTarget(null)}
        title={copyTarget ? `Copy ${copyTarget.name}` : ""}
        description="Set how much of your available balance follows this trader."
      >
        {copyTarget && (
          <form onSubmit={confirmCopy} className="space-y-4">
            <Field label="Amount to allocate" hint={`Minimum ${currency(copyTarget.minCopy)}`}>
              <Input
                type="number"
                min={copyTarget.minCopy}
                step="any"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                suffix="USD"
              />
            </Field>
            <Field label="Maximum drawdown before pausing">
              <Select value={riskCap} onChange={(e) => setRiskCap(e.target.value)}>
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="30">30%</option>
              </Select>
            </Field>
            <dl className="space-y-2 rounded-lg border border-border bg-surface p-3.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Trading style</dt>
                <dd>{copyTarget.style}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Risk level</dt>
                <dd>{copyTarget.risk}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Historical max drawdown</dt>
                <dd className="num">{number(copyTarget.maxDrawdown, 1)}%</dd>
              </div>
            </dl>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={submitting}
              disabled={Number(amount) < copyTarget.minCopy}
            >
              Start copying
            </Button>
            <DemoNotice>
              No funds move in this build. Copy execution is handled by the backend.
            </DemoNotice>
          </form>
        )}
      </Modal>

      <Modal
        open={Boolean(viewTarget)}
        onClose={() => setViewTarget(null)}
        title={viewTarget?.name ?? ""}
        description={viewTarget?.handle}
        size="lg"
        footer={
          <Button
            className="w-full"
            onClick={() => {
              setCopyTarget(viewTarget);
              setViewTarget(null);
            }}
          >
            Copy this trader
          </Button>
        }
      >
        {viewTarget && (
          <div className="space-y-5">
            <AreaChart values={viewTarget.spark} positive={viewTarget.return12m >= 0} height={180} />
            <p className="text-sm text-muted-foreground">{viewTarget.bio}</p>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["12m return", `${number(viewTarget.return12m, 1)}%`],
                ["Win rate", `${viewTarget.winRate}%`],
                ["Max drawdown", `${number(viewTarget.maxDrawdown, 1)}%`],
                ["Copiers", viewTarget.copiers.toLocaleString()],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-border bg-surface p-3">
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="num mt-1 text-sm font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-1.5">
              {viewTarget.assets.map((a) => (
                <Badge key={a}>{a}</Badge>
              ))}
            </div>
            <DemoNotice>
              Historical/demo performance. Past performance does not guarantee future results.
            </DemoNotice>
          </div>
        )}
      </Modal>
    </>
  );
}
