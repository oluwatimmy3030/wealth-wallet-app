import { useState } from "react";
import { Eye, EyeOff, Snowflake } from "lucide-react";
import PageHeader from "../components/common/PageHeader.jsx";
import VirtualCard from "../components/common/VirtualCard.jsx";
import { Card, CardBody, CardHeader } from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Badge, { StatusBadge } from "../components/ui/Badge.jsx";
import { DemoNotice, EmptyState, ErrorState, LoadingState } from "../components/ui/States.jsx";
import useAsync from "../hooks/useAsync.js";
import { getCardActivity, getCards, setCardFrozen } from "../services/api.js";
import { currency, cx, dateTime } from "../lib/format.js";

export default function Cards() {
  const cardsReq = useAsync(getCards, []);
  const [activeId, setActiveId] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [frozenMap, setFrozenMap] = useState({});

  const cards = cardsReq.data ?? [];
  const selectedId = activeId ?? cards[0]?.id ?? null;
  const activityReq = useAsync(
    () => (selectedId ? getCardActivity(selectedId) : Promise.resolve([])),
    [selectedId],
  );

  if (cardsReq.error) return <ErrorState onRetry={cardsReq.reload} />;

  const selected = cards.find((c) => c.id === selectedId);
  const frozen = selected ? (frozenMap[selected.id] ?? selected.frozen) : false;

  const toggleFreeze = async () => {
    if (!selected) return;
    const next = !frozen;
    setFrozenMap((m) => ({ ...m, [selected.id]: next }));
    await setCardFrozen(selected.id, next);
  };

  return (
    <>
      <PageHeader
        title="Cards"
        description="Global virtual cards for online and international spending."
        actions={<Button size="sm">Request new card</Button>}
      />

      {cardsReq.loading ? (
        <Card>
          <LoadingState rows={4} />
        </Card>
      ) : cards.length === 0 ? (
        <Card>
          <EmptyState title="No cards yet" description="Request a virtual card to get started." />
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="space-y-4 xl:col-span-2">
            <div className="flex flex-wrap gap-2">
              {cards.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveId(c.id);
                    setRevealed(false);
                  }}
                  className={cx(
                    "focus-ring rounded-lg border px-3.5 py-2 text-sm font-semibold",
                    c.id === selectedId
                      ? "border-primary bg-primary/10"
                      : "border-border bg-surface text-muted-foreground",
                  )}
                >
                  {c.brand} ·{c.last4}
                </button>
              ))}
            </div>

            {selected && (
              <Card>
                <CardBody className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <VirtualCard card={{ ...selected, frozen }} revealed={revealed} />
                  <div className="min-w-0 space-y-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={frozen ? "Frozen" : selected.status} />
                      <Badge tone="neutral">{selected.currency}</Badge>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Card balance
                      </p>
                      <p className="num text-2xl font-semibold">
                        {currency(selected.balance, selected.currency)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => setRevealed((v) => !v)}>
                        {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {revealed ? "Hide details" : "Show details"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={toggleFreeze}>
                        <Snowflake className="h-4 w-4" />
                        {frozen ? "Unfreeze" : "Freeze"}
                      </Button>
                    </div>
                    <DemoNotice>Card numbers shown are demo values.</DemoNotice>
                  </div>
                </CardBody>
              </Card>
            )}

            <Card>
              <CardHeader title="Card activity" />
              {activityReq.loading ? (
                <LoadingState />
              ) : (activityReq.data ?? []).length === 0 ? (
                <EmptyState title="No activity" description="Spending will appear here." />
              ) : (
                <ul>
                  {activityReq.data.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center gap-3 border-b border-border px-5 py-3.5 last:border-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{a.merchant}</p>
                        <p className="truncate text-xs text-muted-foreground">{dateTime(a.date)}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="num text-sm font-semibold">
                          {currency(a.amount, a.currency)}
                        </p>
                        <div className="mt-1 flex justify-end">
                          <StatusBadge status={a.status} />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <Card>
            <CardHeader title="Card controls" />
            <CardBody className="space-y-2 text-sm text-muted-foreground">
              <p>Freeze instantly if your card details are exposed.</p>
              <p>Spending limits and online-payment controls are managed by your backend service.</p>
              <p>Foreign exchange rates apply to non-base-currency spending.</p>
            </CardBody>
          </Card>
        </div>
      )}
    </>
  );
}
