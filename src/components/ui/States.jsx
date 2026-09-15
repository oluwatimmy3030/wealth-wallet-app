import { AlertTriangle, Inbox } from "lucide-react";
import Button from "./Button.jsx";
import { cx } from "../../lib/format.js";

export function LoadingState({ rows = 3, className }) {
  return (
    <div className={cx("space-y-3 p-5", className)} role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-muted/60" />
      ))}
    </div>
  );
}

export function EmptyState({ title, description, action, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-secondary">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-destructive/15">
        <AlertTriangle className="h-5 w-5 text-destructive" />
      </span>
      <h3 className="text-base font-semibold">Couldn’t load this</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function DemoNotice({ className, children }) {
  return (
    <p className={cx("text-xs text-muted-foreground", className)}>
      {children ??
        "Demo data shown for interface development. Not live market or account data."}
    </p>
  );
}
