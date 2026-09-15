import { Link } from "react-router-dom";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CandlestickChart,
  CreditCard,
  PiggyBank,
  Send,
} from "lucide-react";

const actions = [
  { to: "/wallet/deposit", label: "Deposit", icon: ArrowDownToLine },
  { to: "/wallet/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
  { to: "/trade", label: "Trade", icon: CandlestickChart },
  { to: "/wallet", label: "Transfer", icon: Send },
  { to: "/earn", label: "Earn", icon: PiggyBank },
  { to: "/cards", label: "Cards", icon: CreditCard },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {actions.map(({ to, label, icon: Icon }) => (
        <Link
          key={label}
          to={to}
          className="focus-ring flex flex-col items-center gap-2 rounded-lg border border-border bg-surface px-2 py-3.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-surface-elevated"
        >
          <Icon className="h-[18px] w-[18px] text-primary" />
          {label}
        </Link>
      ))}
    </div>
  );
}
