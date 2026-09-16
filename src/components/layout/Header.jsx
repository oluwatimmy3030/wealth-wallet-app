import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, Plus, Search } from "lucide-react";
import Logo from "../brand/Logo.jsx";
import Button from "../ui/Button.jsx";
import { user } from "../../data/mockData.js";
import { primaryNav, secondaryNav } from "../../config/navigation.js";

const titleFor = (pathname) =>
  [...primaryNav, ...secondaryNav].find((n) => pathname.startsWith(n.to))?.label ?? "Wealth Wallet";

export default function Header({ onOpenMenu }) {
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md pt-[env(safe-area-inset-top)]">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onOpenMenu}
            aria-label="Open menu"
            className="focus-ring -ml-1 rounded-lg p-2 text-muted-foreground hover:text-foreground lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="lg:hidden">
            <Logo withWordmark={false} size={28} />
          </span>
          <h1 className="hidden truncate text-lg font-semibold lg:block">{titleFor(pathname)}</h1>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative ml-2 hidden min-w-0 flex-1 max-w-xs xl:block"
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assets"
              aria-label="Search assets"
              className="focus-ring h-9 w-full rounded-lg border border-input bg-surface pl-9 pr-3 text-sm placeholder:text-muted-foreground/70"
            />
          </form>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button as={Link} to="/wallet/deposit" size="sm" className="hidden sm:inline-flex">
            <Plus className="h-4 w-4" />
            Deposit
          </Button>
          <button
            aria-label="Notifications"
            className="focus-ring relative rounded-lg p-2 text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-gold" />
          </button>
          <Link
            to="/settings"
            aria-label="Account settings"
            className="focus-ring flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 hover:bg-secondary"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-primary">
              {user.initials}
            </span>
            <span className="hidden min-w-0 text-left md:block">
              <span className="block truncate text-sm font-semibold leading-tight">
                {user.firstName} {user.lastName}
              </span>
              <span className="block text-xs text-muted-foreground">{user.tier}</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
