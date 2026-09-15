import { NavLink } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { mobileNav } from "../../config/navigation.js";
import { cx } from "../../lib/format.js";

export default function MobileNav({ onMore }) {
  const items = [...mobileNav, { to: "__more", label: "More", icon: MoreHorizontal }];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) =>
          to === "__more" ? (
            <li key={to}>
              <button
                onClick={onMore}
                className="focus-ring flex w-full flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground"
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            </li>
          ) : (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cx(
                    "focus-ring flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cx("h-5 w-5", isActive && "text-primary")} />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
