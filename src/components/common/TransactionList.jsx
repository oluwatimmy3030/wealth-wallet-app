import {
  ArrowDownLeft,
  ArrowUpRight,
  CandlestickChart,
  CreditCard,
  PiggyBank,
  Send,
  Users,
} from "lucide-react";
import { StatusBadge } from "../ui/Badge.jsx";
import { currency, cx, dateTime, number } from "../../lib/format.js";

const iconFor = {
  Deposit: ArrowDownLeft,
  Withdrawal: ArrowUpRight,
  Trade: CandlestickChart,
  Transfer: Send,
  Earn: PiggyBank,
  Card: CreditCard,
  "Copy trading": Users,
};

const fiat = ["USD", "EUR", "GBP", "NGN"];

export function TransactionRow({ tx }) {
  const Icon = iconFor[tx.type] ?? CandlestickChart;
  const positive = tx.amount >= 0;
  const amount = fiat.includes(tx.asset)
    ? currency(Math.abs(tx.amount), tx.asset)
    : `${number(Math.abs(tx.amount), 4)} ${tx.asset}`;

  return (
    <li className="flex items-center gap-3 border-b border-border px-4 py-3.5 last:border-0 sm:px-5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{tx.description}</p>
        <p className="truncate text-xs text-muted-foreground">
          {tx.type} · {dateTime(tx.date)}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className={cx("num text-sm font-semibold", positive ? "text-positive" : "text-foreground")}>
          {positive ? "+" : "−"}
          {amount}
        </p>
        <div className="mt-1 flex justify-end">
          <StatusBadge status={tx.status} />
        </div>
      </div>
    </li>
  );
}

export default function TransactionList({ transactions }) {
  return (
    <ul>
      {transactions.map((tx) => (
        <TransactionRow key={tx.id} tx={tx} />
      ))}
    </ul>
  );
}
