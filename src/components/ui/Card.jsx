import { cx } from "../../lib/format.js";

export function Card({ className, children, ...props }) {
  return (
    <section className={cx("surface-card", className)} {...props}>
      {children}
    </section>
  );
}

export function CardHeader({ title, subtitle, action, className }) {
  return (
    <header
      className={cx(
        "flex items-start justify-between gap-4 border-b border-border px-5 py-4",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="truncate text-base font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

export function CardBody({ className, children }) {
  return <div className={cx("p-5", className)}>{children}</div>;
}
