import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader.jsx";
import { Card, CardBody, CardHeader } from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import { Field, Input, Select } from "../components/ui/Input.jsx";
import { DemoNotice } from "../components/ui/States.jsx";
import useAsync from "../hooks/useAsync.js";
import { createWithdrawal, getWalletBalances } from "../services/api.js";
import { currency, number } from "../lib/format.js";

export default function Withdraw() {
  const navigate = useNavigate();
  const balancesReq = useAsync(getWalletBalances, []);
  const [asset, setAsset] = useState("USD");
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState("idle");

  const balances = balancesReq.data ?? [];
  const selected = balances.find((b) => b.asset === asset);
  const value = Number(amount || 0);
  const exceeds = selected ? value > selected.balance : false;

  const submit = async (e) => {
    e.preventDefault();
    if (!value || exceeds || !destination.trim()) return;
    setStatus("loading");
    try {
      await createWithdrawal({ asset, amount: value, destination });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <PageHeader
        title="Withdraw"
        description="Send funds from your Wealth Wallet account to an external destination."
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/wallet")}>
            Back to wallet
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader title="Withdrawal details" />
          <CardBody>
            {status === "success" ? (
              <div className="space-y-4">
                <p className="text-sm">
                  Withdrawal request submitted for review. You’ll see it as{" "}
                  <span className="font-semibold">Pending</span> in transactions until the Wealth
                  Wallet backend service settles it.
                </p>
                <div className="flex gap-2">
                  <Button onClick={() => navigate("/transactions")}>View transactions</Button>
                  <Button variant="outline" onClick={() => setStatus("idle")}>
                    New withdrawal
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <Field label="Asset">
                  <Select value={asset} onChange={(e) => setAsset(e.target.value)}>
                    {balances.map((b) => (
                      <option key={b.asset} value={b.asset}>
                        {b.asset} — {b.name}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field
                  label="Amount"
                  error={exceeds ? "Amount exceeds your available balance." : undefined}
                  hint={
                    selected
                      ? `Available ${number(selected.balance, selected.type === "crypto" ? 4 : 2)} ${asset}`
                      : undefined
                  }
                >
                  <Input
                    inputMode="decimal"
                    placeholder="0.00"
                    suffix={asset}
                    invalid={exceeds}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Field>

                <Field
                  label="Destination"
                  hint="Bank account reference or wallet address."
                >
                  <Input
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </Field>

                {status === "error" && (
                  <p className="text-sm text-destructive">
                    Couldn’t submit the withdrawal. Please try again.
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={!value || exceeds || !destination.trim() || status === "loading"}
                >
                  {status === "loading" ? "Submitting…" : "Request withdrawal"}
                </Button>
                <DemoNotice>This is a demo interface — no funds are actually sent.</DemoNotice>
              </form>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Summary" />
          <CardBody className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="num font-semibold">
                {number(value, 4)} {asset}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated value</span>
              <span className="num font-medium">
                {currency(selected ? (selected.usdValue / (selected.balance || 1)) * value : 0)}
              </span>
            </div>
            <DemoNotice>
              Withdrawals are reviewed before settlement. Network fees may apply.
            </DemoNotice>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
