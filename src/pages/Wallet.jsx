import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownLeft, ArrowUpRight, Send } from "lucide-react";
import PageHeader from "../components/common/PageHeader.jsx";
import { AssetIcon } from "../components/common/AssetTable.jsx";
import { Card, CardBody, CardHeader } from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Tabs from "../components/ui/Tabs.jsx";
import Modal from "../components/ui/Modal.jsx";
import { Field, Input, Select } from "../components/ui/Input.jsx";
import { DemoNotice, ErrorState, LoadingState } from "../components/ui/States.jsx";
import useAsync from "../hooks/useAsync.js";
import { getWalletBalances } from "../services/api.js";
import { currency, number } from "../lib/format.js";

const filters = [
  { id: "all", label: "All" },
  { id: "fiat", label: "Fiat" },
  { id: "crypto", label: "Crypto" },
];

export default function Wallet() {
  const [filter, setFilter] = useState("all");
  const [transferOpen, setTransferOpen] = useState(false);
  const [transfer, setTransfer] = useState({ asset: "USD", amount: "", destination: "Earn" });
  const req = useAsync(getWalletBalances, []);

  if (req.error) return <ErrorState onRetry={req.reload} />;

  const balances = req.data ?? [];
  const visible = filter === "all" ? balances : balances.filter((b) => b.type === filter);
  const total = balances.reduce((sum, b) => sum + b.usdValue, 0);

  return (
    <>
      <PageHeader
        title="Wallet"
        description="Fiat and crypto balances, deposits, withdrawals and internal transfers."
        actions={
          <>
            <Button as={Link} to="/wallet/deposit" size="sm">
              <ArrowDownLeft className="h-4 w-4" />
              Deposit
            </Button>
            <Button as={Link} to="/wallet/withdraw" size="sm" variant="outline">
              <ArrowUpRight className="h-4 w-4" />
              Withdraw
            </Button>
            <Button size="sm" variant="outline" onClick={() => setTransferOpen(true)}>
              <Send className="h-4 w-4" />
              Transfer
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Balances"
            subtitle="Demo balances for interface development."
            action={<Tabs items={filters} value={filter} onChange={setFilter} size="sm" />}
          />
          {req.loading ? (
            <LoadingState rows={5} />
          ) : (
            <ul>
              {visible.map((b) => (
                <li
                  key={b.asset}
                  className="flex items-center gap-3 border-b border-border px-5 py-3.5 last:border-0"
                >
                  <AssetIcon symbol={b.asset} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{b.asset}</p>
                    <p className="truncate text-xs text-muted-foreground">{b.name}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="num text-sm font-semibold">
                      {number(b.balance, b.type === "crypto" ? 4 : 2)}
                    </p>
                    <p className="num text-xs text-muted-foreground">{currency(b.usdValue)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Total wallet value" />
            <CardBody>
              <p className="num font-[family-name:var(--font-display)] text-3xl font-semibold">
                {currency(total)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Across fiat and crypto balances</p>
              <DemoNotice className="mt-4" />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Good to know" />
            <CardBody className="space-y-2 text-sm text-muted-foreground">
              <p>Deposits and withdrawals are reviewed before settlement.</p>
              <p>Network and processing fees may apply and vary by method.</p>
              <p>Investing involves risk. Capital at risk.</p>
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        title="Internal transfer"
        description="Move funds between your Wealth Wallet accounts."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setTransferOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setTransferOpen(false)}>Review transfer</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Asset">
            <Select
              value={transfer.asset}
              onChange={(e) => setTransfer({ ...transfer, asset: e.target.value })}
            >
              {balances.map((b) => (
                <option key={b.asset} value={b.asset}>
                  {b.asset} — {b.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Amount">
            <Input
              inputMode="decimal"
              placeholder="0.00"
              suffix={transfer.asset}
              value={transfer.amount}
              onChange={(e) => setTransfer({ ...transfer, amount: e.target.value })}
            />
          </Field>
          <Field label="Destination">
            <Select
              value={transfer.destination}
              onChange={(e) => setTransfer({ ...transfer, destination: e.target.value })}
            >
              <option>Earn</option>
              <option>Trading</option>
              <option>Card</option>
            </Select>
          </Field>
          <DemoNotice>No funds move in this demo interface.</DemoNotice>
        </div>
      </Modal>
    </>
  );
}
