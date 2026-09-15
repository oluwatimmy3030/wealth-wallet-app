import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/common/PageHeader.jsx";
import { Card, CardBody, CardHeader } from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Tabs from "../components/ui/Tabs.jsx";
import { Field, Input, Select, Toggle } from "../components/ui/Input.jsx";
import { DemoNotice } from "../components/ui/States.jsx";
import { fiatCurrencies, user } from "../data/mockData.js";
import { MARKETING_SITE_URL } from "../config/navigation.js";

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "notifications", label: "Notifications" },
  { id: "preferences", label: "Preferences" },
  { id: "support", label: "Support" },
];

function Row({ title, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-4 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function Settings() {
  const [tab, setTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    transactions: true,
    earn: false,
    product: false,
  });
  const [prefs, setPrefs] = useState({ currency: user.baseCurrency, theme: "Dark", compact: false });

  return (
    <>
      <PageHeader
        title="Settings"
        description="Profile, security, notifications and preferences. Interface only — changes are handled by your backend service."
      />

      <div className="mb-4">
        <Tabs items={tabs} value={tab} onChange={setTab} />
      </div>

      {tab === "profile" && (
        <Card>
          <CardHeader title="Profile" subtitle="Your account details." />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Field label="First name">
              <Input defaultValue={user.firstName} />
            </Field>
            <Field label="Last name">
              <Input defaultValue={user.lastName} />
            </Field>
            <Field label="Email" hint="Sign-in is email-based and managed by the backend service.">
              <Input defaultValue={user.email} type="email" />
            </Field>
            <Field label="Account tier">
              <Input defaultValue={user.tier} readOnly />
            </Field>
            <div className="sm:col-span-2">
              <Button>Save changes</Button>
              <DemoNotice className="mt-3">Profile updates are not persisted in this demo.</DemoNotice>
            </div>
          </CardBody>
        </Card>
      )}

      {tab === "security" && (
        <Card>
          <CardHeader title="Security" subtitle="Session and device controls." />
          <CardBody className="pt-0">
            <Row title="Email sign-in" description="Access links are sent to your account email.">
              <span className="text-sm text-muted-foreground">Enabled</span>
            </Row>
            <Row title="Active sessions" description="Chrome · Lagos · last active today">
              <Button size="sm" variant="outline">
                Sign out all
              </Button>
            </Row>
            <Row title="Login alerts" description="Get notified about new sign-ins.">
              <Toggle
                checked
                onChange={() => {}}
                label="Login alerts"
              />
            </Row>
            <DemoNotice className="mt-4">
              Security controls are managed by the Wealth Wallet backend service.
            </DemoNotice>
          </CardBody>
        </Card>
      )}

      {tab === "notifications" && (
        <Card>
          <CardHeader title="Notifications" subtitle="Choose what you hear about." />
          <CardBody className="pt-0">
            {[
              ["priceAlerts", "Price alerts", "Movements on your watchlist assets."],
              ["transactions", "Transaction updates", "Deposits, withdrawals and trades."],
              ["earn", "Earn updates", "Accruals and maturing positions."],
              ["product", "Product news", "Occasional updates from Wealth Wallet."],
            ].map(([key, title, description]) => (
              <Row key={key} title={title} description={description}>
                <Toggle
                  checked={notifications[key]}
                  onChange={(v) => setNotifications({ ...notifications, [key]: v })}
                  label={title}
                />
              </Row>
            ))}
          </CardBody>
        </Card>
      )}

      {tab === "preferences" && (
        <Card>
          <CardHeader title="Preferences" subtitle="Display currency and appearance." />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Field label="Display currency">
              <Select
                value={prefs.currency}
                onChange={(e) => setPrefs({ ...prefs, currency: e.target.value })}
              >
                {fiatCurrencies.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Theme" hint="Wealth Wallet uses a dark premium theme by default.">
              <Select
                value={prefs.theme}
                onChange={(e) => setPrefs({ ...prefs, theme: e.target.value })}
              >
                <option>Dark</option>
                <option>System</option>
              </Select>
            </Field>
            <div className="sm:col-span-2">
              <Row title="Compact numbers" description="Shorten large values, e.g. 184.3K.">
                <Toggle
                  checked={prefs.compact}
                  onChange={(v) => setPrefs({ ...prefs, compact: v })}
                  label="Compact numbers"
                />
              </Row>
            </div>
          </CardBody>
        </Card>
      )}

      {tab === "support" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Support" />
            <CardBody className="space-y-3 text-sm text-muted-foreground">
              <p>Need help with your account or a transaction?</p>
              <Button as="a" href={`${MARKETING_SITE_URL}/contact`} size="sm" variant="outline">
                Contact support
              </Button>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Legal" />
            <CardBody className="space-y-2 text-sm text-muted-foreground">
              <p>
                <a className="underline" href={`${MARKETING_SITE_URL}/terms`}>
                  Terms of service
                </a>
              </p>
              <p>
                <a className="underline" href={`${MARKETING_SITE_URL}/privacy`}>
                  Privacy policy
                </a>
              </p>
              <p>
                Investing involves risk. Capital at risk. Rates are variable and subject to
                eligibility. Historical or demo performance does not guarantee future results.
              </p>
              <p>
                <Link className="underline" to="/dashboard">
                  Back to dashboard
                </Link>
              </p>
            </CardBody>
          </Card>
        </div>
      )}
    </>
  );
}
