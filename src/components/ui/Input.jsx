import { cx } from "../../lib/format.js";

export function Field({ label, hint, error, children, className }) {
  return (
    <label className={cx("block", className)}>
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-muted-foreground">{label}</span>
      )}
      {children}
      {error ? (
        <span className="mt-1.5 block text-sm text-destructive">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

export function Input({ className, invalid, suffix, ...props }) {
  const input = (
    <input
      className={cx(
        "focus-ring h-11 w-full rounded-lg border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70",
        invalid ? "border-destructive" : "border-input",
        suffix && "pr-16",
        className,
      )}
      {...props}
    />
  );
  if (!suffix) return input;
  return (
    <div className="relative">
      {input}
      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
        {suffix}
      </span>
    </div>
  );
}

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cx(
        "focus-ring h-11 w-full appearance-none rounded-lg border border-input bg-surface px-3.5 text-sm text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        "focus-ring relative h-6 w-11 shrink-0 rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cx(
          "absolute top-0.5 h-5 w-5 rounded-full bg-background transition-transform",
          checked ? "translate-x-5.5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
