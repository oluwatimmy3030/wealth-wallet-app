export function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="11" fill="#0c1a14" />
      <path
        d="M9 14l4.5 13L19 17l5.5 10L30 12"
        fill="none"
        stroke="#34d399"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="12" r="3" fill="#e8c15c" />
    </svg>
  );
}

export default function Logo({ size = 32, withWordmark = true }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      {withWordmark && (
        <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold tracking-tight">
          Wealth Wallet
        </span>
      )}
    </span>
  );
}
