import { cx } from "../../lib/format.js";

export default function Tabs({ items, value, onChange, className, size = "md" }) {
  return (
    <div
      role="tablist"
      className={cx(
        "inline-flex max-w-full gap-1 overflow-x-auto rounded-lg border border-border bg-surface p-1",
        className,
      )}
    >
      {items.map((item) => {
        const id = item.id ?? item;
        const label = item.label ?? item;
        const active = id === value;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={cx(
              "focus-ring shrink-0 rounded-md font-semibold transition-colors",
              size === "sm" ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-sm",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
