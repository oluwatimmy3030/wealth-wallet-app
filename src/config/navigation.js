import {
  LayoutDashboard,
  LineChart,
  CandlestickChart,
  Users,
  PiggyBank,
  Wallet,
  CreditCard,
  Receipt,
  Settings,
} from "lucide-react";

export const primaryNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/markets", label: "Markets", icon: LineChart },
  { to: "/trade", label: "Trade", icon: CandlestickChart },
  { to: "/copy-trading", label: "Copy Trading", icon: Users },
  { to: "/earn", label: "Earn", icon: PiggyBank },
];

export const secondaryNav = [
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/cards", label: "Cards", icon: CreditCard },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const mobileNav = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/markets", label: "Markets", icon: LineChart },
  { to: "/trade", label: "Trade", icon: CandlestickChart },
  { to: "/wallet", label: "Wallet", icon: Wallet },
];

export const MARKETING_SITE_URL = "https://wealthwallet.net";
