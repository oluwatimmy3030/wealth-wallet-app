import { useState } from "react";
import { Info } from "lucide-react";
import PageHeader from "../components/common/PageHeader.jsx";
import { Card, CardBody, CardHeader } from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Modal from "../components/ui/Modal.jsx";
import { Field, Input } from "../components/ui/Input.jsx";
import { DemoNotice, EmptyState, LoadingState } from "../components/ui/States.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import useAsync from "../hooks/useAsync.js";
import { getEarnPositions, getEarnProducts, subscribeToEarn } from "../services/api.js";
import { currency, number, shortDate } from "../lib/format.js";

export default function Earn() {
  const productsReq = useAsync(getEarnProducts, []);
  const positionsReq = useAsync(getEarnPositions, []);
  const toast = useToast();
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const estimated =
    selected && Number(amount) > 0
      ? (Number(amount) * selected.apy) / 100 * (selected.term === "Flexible" ? 1 : parseInt(selected.term, 10) / 365)
      : 0;

  async function subscribe(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await subscribeToEarn({ productId: selected.id, amount: Number(amount) });
      toast.push({
        tone: "success",
        title: "Subscription submitted (demo)",
        description: `${selected.name} — pending backend confirmation.`,
      });
      setSelected(null);
      setAmount("");
    } catch (err) {
      toast.push({ tone: "error", title: "Couldn’t subscribe", description: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Earn"
        description="Put your eligible assets to work. Up to 9.6% p.a. on eligible products."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <CardHeader title="Available products" subtitle="Rates are variable and subject to eligibility." />
          {productsReq.loading ? (
            <LoadingState rows={4} />
          ) : (
            <ul>
              {productsReq.data.map((p) => (
                <li
                  key={p.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border px-5 py-4 last:border-0"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-semibold">{p.name}</h3>
                      <Badge tone="neutral">{p.type}</Badge>
                      {!p.eligible && <Badge tone="negative">Unavailable</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                    <p className="num mt-1.5 text-xs text-muted-foreground">
                      Term {p.term} · Minimum {p.minAmount} {p.asset}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="num text-lg font-semibold text-primary">{number(p.apy, 1)}%</p>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">p.a.</p>
                    <Button
                      size="sm"
                      className="mt-2"
                      disabled={!p.eligible}
                      onClick={() => setSelected(p)}
                    >
                      Start
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Active earn positions" />
            {positionsReq.loading ? (
              <LoadingState rows={2} />
            ) : positionsReq.data.length === 0 ? (
              <EmptyState title="No active positions" description="Subscribe to a product to start earning." />
            ) : (
              <CardBody className="space-y-3">
                {positionsReq.data.map((pos) => (
                  <div key={pos.id} className="rounded-lg border border-border bg-surface p-4">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <p className="truncate text-sm font-semibold">{pos.name}</p>
                      <Badge tone="positive">{number(pos.apy, 1)}% p.a.</Badge>
                    </div>
                    <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-xs text-muted-foreground">Principal</dt>
                        <dd className="num font-semibold">{currency(pos.principal)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Accrued</dt>
                        <dd className="num font-semibold text-positive">+{currency(pos.accrued)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Started</dt>
                        <dd className="text-sm">{shortDate(pos.startedAt)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Matures</dt>
                        <dd className="text-sm">{pos.maturesAt ? shortDate(pos.maturesAt) : "Flexible"}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </CardBody>
            )}
          </Card>

          <Card>
            <CardBody>
              <p className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                Up to 9.6% p.a. applies to eligible products only. Rates are variable, eligibility
                and availability vary by region and product, and returns are not guaranteed.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? selected.name : ""}
        description={selected ? `${number(selected.apy, 1)}% p.a. · ${selected.term}` : ""}
      >
        {selected && (
          <form onSubmit={subscribe} className="space-y-4">
            <Field label="Amount" hint={`Minimum ${selected.minAmount} ${selected.asset}`}>
              <Input
                type="number"
                min={selected.minAmount}
                step="any"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                suffix={selected.asset}
              />
            </Field>
            <dl className="space-y-2 rounded-lg border border-border bg-surface p-3.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Term</dt>
                <dd>{selected.term}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Estimated earnings</dt>
                <dd className="num font-semibold">
                  {number(estimated, 2)} {selected.asset}
                </dd>
              </div>
            </dl>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={submitting}
              disabled={Number(amount) < selected.minAmount}
            >
              Subscribe
            </Button>
            <DemoNotice>
              Estimates are illustrative. Rates are variable and returns are not guaranteed.
            </DemoNotice>
          </form>
        )}
      </Modal>
    </>
  );
}
