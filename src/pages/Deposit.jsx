import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader.jsx";
import { Card, CardBody, CardHeader } from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import { Field, Input, Select } from "../components/ui/Input.jsx";
import { DemoNotice } from "../components/ui/States.jsx";
import { fiatCurrencies, paymentMethods } from "../data/mockData.js";
import { createDeposit } from "../services/api.js";
import { currency, cx } from "../lib/format.js";

export default function Deposit() {
  const navigate = useNavigate();
  const [method, setMethod] = useState(paymentMethods[0].id);
  const [amount, setAmount] = useState("");
  const [fiat, setFiat] = useState("USD");
  const [status, setStatus] = useState("idle");

  const value = Number(amount || 0);

  const submit = async (e) => {
    e.preventDefault();
    if (!value) return;
    setStatus("loading");
    try {
      await createDeposit({ method, amount: value, currency: fiat });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <PageHeader
        title="Deposit"
        description="Add funds to your Wealth Wallet account."
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/wallet")}>
            Back to wallet
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader title="Deposit details" />
          <CardBody>
            {status === "success" ? (
              <div className="space-y-4">
                <p className="text-sm">
                  Deposit request for{" "}
                  <span className="num font-semibold">{currency(value, fiat)}</span> submitted.
                  Settlement is handled by the Wealth Wallet backend service.
                </p>
                <div className="flex gap-2">
                  <Button onClick={() => navigate("/transactions")}>View transactions</Button>
                  <Button variant="outline" onClick={() => setStatus("idle")}>
                    New deposit
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-muted-foreground">
                    Payment method
                  </legend>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {paymentMethods.map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setMethod(pm.id)}
                        className={cx(
                          "focus-ring rounded-lg border p-3 text-left",
                          method === pm.id
                            ? "border-primary bg-primary/10"
                            : "border-border bg-surface",
                        )}
                      >
                        <span className="block text-sm font-semibold">{pm.label}</span>
                        <span className="block text-xs text-muted-foreground">{pm.detail}</span>
                        <span className="block text-xs text-muted-foreground">Fee {pm.fee}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
                  <Field label="Amount">
                    <Input
                      inputMode="decimal"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </Field>
                  <Field label="Currency">
                    <Select value={fiat} onChange={(e) => setFiat(e.target.value)}>
                      {fiatCurrencies.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </Select>
                  </Field>
                </div>

                {status === "error" && (
                  <p className="text-sm text-destructive">
                    Couldn’t submit the deposit. Please try again.
                  </p>
                )}

                <Button type="submit" disabled={!value || status === "loading"}>
                  {status === "loading" ? "Submitting…" : "Continue"}
                </Button>
                <DemoNotice>
                  This is a demo interface — no real payment is taken or processed.
                </DemoNotice>
              </form>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Summary" />
          <CardBody className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="num font-semibold">{currency(value, fiat)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Method</span>
              <span className="font-medium">
                {paymentMethods.find((p) => p.id === method)?.label}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <span className="text-muted-foreground">Estimated fee</span>
              <span className="font-medium">{paymentMethods.find((p) => p.id === method)?.fee}</span>
            </div>
            <DemoNotice>Fees shown are indicative and confirmed before settlement.</DemoNotice>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
