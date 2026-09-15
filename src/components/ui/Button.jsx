import { cx } from "../../lib/format.js";

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-glow active:scale-[0.99] shadow-[0_8px_24px_-12px_var(--color-primary)]",
  secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
  outline: "border border-border bg-transparent text-foreground hover:bg-secondary",
  ghost: "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
  gold: "bg-gold text-gold-foreground hover:brightness-105",
  danger: "bg-destructive text-destructive-foreground hover:brightness-110",
};

const sizes = {
  sm: "h-9 px-3 text-sm rounded-md gap-1.5",
  md: "h-11 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-base rounded-lg gap-2",
  icon: "h-10 w-10 rounded-lg justify-center",
};

export default function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <Tag
      className={cx(
        "focus-ring inline-flex select-none items-center justify-center font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={Tag === "button" ? disabled || loading : undefined}
      {...props}
    >
      {loading && (
        <span
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </Tag>
  );
}
