import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import Logo from "../components/brand/Logo.jsx";
import Button from "../components/ui/Button.jsx";
import { Field, Input } from "../components/ui/Input.jsx";
import { submitEmail } from "../services/api.js";
import { isEmail } from "../lib/format.js";
import { MARKETING_SITE_URL } from "../config/navigation.js";

const copy = {
  login: {
    title: "Welcome back to Wealth Wallet",
    subtitle: "Enter your email to continue.",
    cta: "Continue",
    alt: "New to Wealth Wallet?",
    altLink: "/signup",
    altLabel: "Create an account",
  },
  signup: {
    title: "Welcome to Wealth Wallet",
    subtitle: "Enter your email to continue.",
    cta: "Continue",
    alt: "Already have an account?",
    altLink: "/login",
    altLabel: "Log in",
  },
};

const highlights = [
  "Trade stocks, crypto and futures in one account",
  "Copy experienced traders at the tap of a button",
  "Up to 9.6% p.a. on eligible earn products",
  "Global virtual cards for everyday spending",
];

export default function AuthPage({ mode = "login" }) {
  const t = copy[mode];
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);

  const invalid = touched && email.length > 0 && !isEmail(email);
  const canSubmit = isEmail(email) && status !== "loading";

  async function onSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!isEmail(email)) return;
    setStatus("loading");
    setError(null);
    try {
      // INTEGRATION POINT — backend decides what happens next (link, code, session).
      await submitEmail(email.trim());
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message || "We couldn’t continue. Please try again.");
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_minmax(0,520px)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-surface p-12 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        />
        <a href={MARKETING_SITE_URL} className="focus-ring relative rounded-md">
          <Logo size={34} />
        </a>
        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold leading-tight">Grow your wealth with Wealth Wallet</h2>
          <ul className="mt-7 space-y-3.5">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {h}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          Investing involves risk. Capital at risk.
        </p>
      </aside>

      <main className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="animate-rise w-full max-w-sm">
          <span className="lg:hidden">
            <Logo size={34} />
          </span>

          {status === "success" ? (
            <div className="mt-8">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/12">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </span>
              <h1 className="mt-5 text-2xl font-semibold">Check your inbox</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We’ve sent the next step to <span className="text-foreground">{email}</span>.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Sign-in is completed by the Wealth Wallet backend service.
              </p>
              <div className="mt-7 flex flex-col gap-2">
                <Button onClick={() => navigate("/dashboard")}>
                  Continue to app
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={() => setStatus("idle")}>
                  Use a different email
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="mt-8 text-2xl font-semibold sm:text-3xl">{t.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{t.subtitle}</p>

              <form onSubmit={onSubmit} noValidate className="mt-7 space-y-4">
                <Field
                  label="Email address"
                  error={invalid ? "Enter a valid email address." : null}
                  hint={!invalid ? "We’ll only use this to sign you in." : null}
                >
                  <Input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="you@example.com"
                    value={email}
                    invalid={invalid}
                    onBlur={() => setTouched(true)}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>

                {status === "error" && (
                  <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <Button type="submit" size="lg" className="w-full" loading={status === "loading"} disabled={!canSubmit}>
                  {status === "loading" ? "Checking…" : t.cta}
                  {status !== "loading" && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>

              <p className="mt-6 text-sm text-muted-foreground">
                {t.alt}{" "}
                <Link to={t.altLink} className="focus-ring rounded-sm font-semibold text-primary">
                  {t.altLabel}
                </Link>
              </p>

              <p className="mt-8 text-xs text-muted-foreground">
                By continuing you agree to the Wealth Wallet Terms of Service and Privacy Policy.
                Investing involves risk, including possible loss of capital.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
