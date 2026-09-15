import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import PageHeader from "../components/common/PageHeader.jsx";
import TransactionList from "../components/common/TransactionList.jsx";
import { Card, CardHeader } from "../components/ui/Card.jsx";
import Tabs from "../components/ui/Tabs.jsx";
import { Select } from "../components/ui/Input.jsx";
import { DemoNotice, EmptyState, ErrorState, LoadingState } from "../components/ui/States.jsx";
import useAsync from "../hooks/useAsync.js";
import { getTransactions } from "../services/api.js";
import { transactionStatuses, transactionTypes } from "../data/mockData.js";

const statusTabs = [{ id: "All", label: "All" }, ...transactionStatuses.map((s) => ({ id: s, label: s }))];

export default function Transactions() {
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [query, setQuery] = useState("");
  const req = useAsync(getTransactions, []);

  const rows = useMemo(() => {
    const list = req.data ?? [];
    const q = query.trim().toLowerCase();
    return list.filter(
      (tx) =>
        (status === "All" || tx.status === status) &&
        (type === "All" || tx.type === type) &&
        (!q ||
          tx.description.toLowerCase().includes(q) ||
          tx.asset.toLowerCase().includes(q) ||
          tx.id.toLowerCase().includes(q)),
    );
  }, [req.data, status, type, query]);

  if (req.error) return <ErrorState onRetry={req.reload} />;

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Deposits, withdrawals, trades, transfers, earn and card activity."
      />

      <Card>
        <CardHeader
          title="History"
          subtitle="Demo history for interface development."
          action={<Tabs items={statusTabs} value={status} onChange={setStatus} size="sm" />}
        />

        <div className="grid gap-3 border-b border-border px-5 py-4 sm:grid-cols-[minmax(0,1fr)_200px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search transactions"
              aria-label="Search transactions"
              className="focus-ring h-11 w-full rounded-lg border border-input bg-surface pl-9 pr-3 text-sm placeholder:text-muted-foreground/70"
            />
          </div>
          <Select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by type">
            <option value="All">All types</option>
            {transactionTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </div>

        {req.loading ? (
          <LoadingState rows={6} />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="Try a different status, type or search term."
          />
        ) : (
          <TransactionList transactions={rows} />
        )}

        <div className="px-5 py-4">
          <DemoNotice />
        </div>
      </Card>
    </>
  );
}
