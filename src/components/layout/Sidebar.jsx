import { NavLink } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Logo from "../brand/Logo.jsx";
import { primaryNav, secondaryNav, MARKETING_SITE_URL } from "../../config/navigation.js";
import { cx } from "../../lib/format.js";

function Item({ to, label, icon: Icon, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cx(
          "focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-accent text-foreground"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={cx("h-[18px] w-[18px] shrink-0", isActive && "text-primary")} />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ onNavigate }) {
  return (
    <div className="flex h-full flex-col gap-6 border-r border-border bg-surface px-4 py-5">
      <div className="px-2">
        <Logo />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
            Invest
          </p>
          {primaryNav.map((item) => (
            <Item key={item.to} {...item} onNavigate={onNavigate} />
          ))}
        </div>
        <div className="space-y-1">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
            Account
          </p>
          {secondaryNav.map((item) => (
            <Item key={item.to} {...item} onNavigate={onNavigate} />
          ))}
        </div>
      </nav>

      <a
        href={MARKETING_SITE_URL}
        className="focus-ring flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        wealthwallet.net
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
