import { useEffect } from "react";
import { X } from "lucide-react";
import { cx } from "../../lib/format.js";

/** Centered dialog on desktop, bottom sheet on mobile. */
export default function Modal({ open, onClose, title, description, children, footer, size = "md" }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-90 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx(
          "animate-rise relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-border bg-surface-elevated shadow-[var(--shadow-lift)] sm:rounded-2xl",
          size === "lg" ? "sm:max-w-2xl" : size === "sm" ? "sm:max-w-sm" : "sm:max-w-lg",
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold">{title}</h2>
            {description && (
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="focus-ring -mr-1 rounded-md p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="border-t border-border px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
