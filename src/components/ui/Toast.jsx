import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cx } from "../../lib/format.js";

const ToastContext = createContext({ push: () => {} });

export const useToast = () => useContext(ToastContext);

const icons = { success: CheckCircle2, error: XCircle, info: Info };

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const remove = useCallback((id) => setItems((prev) => prev.filter((t) => t.id !== id)), []);

  const push = useCallback(
    (toast) => {
      const id = `${Date.now()}-${Math.random()}`;
      setItems((prev) => [...prev, { id, tone: "info", ...toast }]);
      setTimeout(() => remove(id), toast.duration ?? 4200);
    },
    [remove],
  );

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-100 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end">
        {items.map((t) => {
          const Icon = icons[t.tone] ?? Info;
          return (
            <div
              key={t.id}
              className="animate-rise pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-border bg-surface-elevated p-3.5 shadow-[var(--shadow-lift)]"
            >
              <Icon
                className={cx(
                  "mt-0.5 h-5 w-5 shrink-0",
                  t.tone === "success"
                    ? "text-primary"
                    : t.tone === "error"
                      ? "text-destructive"
                      : "text-muted-foreground",
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => remove(t.id)}
                aria-label="Dismiss"
                className="focus-ring rounded-sm text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
