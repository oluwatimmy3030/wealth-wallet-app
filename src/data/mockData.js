/**
 * DEMO DATA ONLY — not real market or account data.
 * Shapes here mirror the expected API responses so the backend developer can
 * swap `src/services/api.js` implementations without touching components.
 */

export const DEMO_DATA_NOTICE =
    "Demo data shown for interface development. Not live market or account data.";

export const user = {
    id: "usr_demo_001",
    firstName: "Xential",
    lastName: "Samuel",
    email: "xential@example.com",
    initials: "XO",
    tier: "Wealth Plus",
    baseCurrency: "USD",
    verified: true,
};

export const portfolio = {
    totalValue: 184320.45,
    availableBalance: 21460.12,
    investedValue: 162860.33,
    todayChange: 2148.9,
    todayChangePercent: 1.18,
    allTimeChangePercent: 24.6,
    earnBalance: 38200.0,
    currency: "USD",
};

export const allocation = [
    { label: "Stocks", value: 68240.2, percent: 37, color: "var(--color-primary)" },
    { label: "Crypto", value: 52310.8, percent: 28.4, color: "var(--color-gold)" },
    { label: "Futures", value: 25100.0, percent: 13.6, color: "oklch(70% 0.12 200)" },
    { label: "Earn", value: 38200.0, percent: 20.7, color: "oklch(60% 0.06 165)" },
];

const series = (start, points, volatility) => {
    let value = start;
    return Array.from({ length: points }, (_, i) => {
        value += (Math.sin(i / 2.4) + Math.cos(i / 5)) * volatility + volatility * 0.35;
        return { t: i, v: Math.round(value * 100) / 100 };
    });
};

export const portfolioSeries = {
    "1D": series(181500, 24, 90),
    "1W": series(176000, 28, 260),
    "1M": series(163000, 30, 520),
    "1Y": series(132000, 48, 900),
    ALL: series(84000, 60, 1500),
};

export const assets = [{
        symbol: "AAPL",
        name: "Apple Inc.",
        category: "stocks",
        price: 241.32,
        change24h: 1.24,
        marketCap: 3620000000000,
        volume: 48200000,
        spark: series(228, 24, 1.6).map((p) => p.v),
    },
    {
        symbol: "NVDA",
        name: "NVIDIA Corp.",
        category: "stocks",
        price: 178.94,
        change24h: 2.86,
        marketCap: 4380000000000,
        volume: 92400000,
        spark: series(160, 24, 1.9).map((p) => p.v),
    },
    {
        symbol: "TSLA",
        name: "Tesla Inc.",
        category: "stocks",
        price: 322.11,
        change24h: -1.42,
        marketCap: 1020000000000,
        volume: 71100000,
        spark: series(340, 24, 2.4).map((p) => p.v),
    },
    {
        symbol: "BTC",
        name: "Bitcoin",
        category: "crypto",
        price: 92840.5,
        change24h: 3.14,
        marketCap: 1830000000000,
        volume: 42800000000,
        spark: series(86000, 24, 480).map((p) => p.v),
    },
    {
        symbol: "ETH",
        name: "Ethereum",
        category: "crypto",
        price: 3184.22,
        change24h: -0.86,
        marketCap: 383000000000,
        volume: 18200000000,
        spark: series(3260, 24, 26).map((p) => p.v),
    },
    {
        symbol: "CL",
        name: "Crude Oil",
        category: "futures",
        price: 71.84,
        change24h: -1.93,
        contract: "Nov 2026",
        volume: 480000,
        spark: series(76, 24, 0.6).map((p) => p.v),
    },
];

export const assetCategories = [
    { id: "all", label: "All" },
    { id: "stocks", label: "Stocks" },
    { id: "crypto", label: "Crypto" },
    { id: "futures", label: "Futures" },
];

export const positions = [{
        id: "pos_1",
        symbol: "NVDA",
        name: "NVIDIA Corp.",
        side: "long",
        quantity: 120,
        entryPrice: 154.2,
        markPrice: 178.94,
        pnl: 2968.8,
        pnlPercent: 16.04,
        category: "stocks",
    },
    {
        id: "pos_2",
        symbol: "BTC",
        name: "Bitcoin",
        side: "long",
        quantity: 0.42,
        entryPrice: 78400,
        markPrice: 92840.5,
        pnl: 6065.01,
        pnlPercent: 18.42,
        category: "crypto",
    },
];

export const orders = [{
        id: "ord_1041",
        symbol: "ETH",
        side: "buy",
        type: "limit",
        quantity: 1.5,
        price: 3050,
        status: "Pending",
        createdAt: "2026-09-12T09:24:00Z",
    },
    {
        id: "ord_1040",
        symbol: "AAPL",
        side: "sell",
        type: "market",
        quantity: 25,
        price: 240.88,
        status: "Completed",
        createdAt: "2026-09-11T14:02:00Z",
    },
];

export const traders = [{
        id: "trd_1",
        name: "Marcus Ilori",
        handle: "@marcus.macro",
        style: "Macro swing",
        risk: "Medium",
        followers: 4820,
        copiers: 1240,
        return12m: 38.4,
        winRate: 62,
        maxDrawdown: 14.2,
        assets: ["Stocks", "Futures"],
        minCopy: 250,
        spark: series(100, 24, 1.4).map((p) => p.v),
        bio: "Trades index futures and large-cap equities around macro data releases. Historical figures are demo data and do not indicate future results.",
    },
    {
        id: "trd_2",
        name: "Lena Vogt",
        handle: "@lenav",
        style: "Crypto momentum",
        risk: "High",
        followers: 9130,
        copiers: 3410,
        return12m: 71.2,
        winRate: 54,
        maxDrawdown: 31.8,
        assets: ["Crypto"],
        minCopy: 100,
        spark: series(100, 24, 3.1).map((p) => p.v),
        bio: "Momentum-driven crypto positions with active risk controls. Higher volatility; capital at risk.",
    },
];

export const copyPositions = [
    { id: "cp_1", traderId: "trd_1", traderName: "Marcus Ilori", allocated: 5000, pnl: 612.4, pnlPercent: 12.2, since: "2026-05-14T00:00:00Z" },
];

export const earnProducts = [{
        id: "earn_usdt_flex",
        asset: "USDT",
        name: "USDT Flexible",
        apy: 6.2,
        term: "Flexible",
        minAmount: 50,
        type: "Flexible",
        eligible: true,
        description: "Withdraw any time. Rate is variable and reviewed regularly.",
    },
    {
        id: "earn_usdt_90",
        asset: "USDT",
        name: "USDT 90-Day",
        apy: 9.6,
        term: "90 days",
        minAmount: 1000,
        type: "Fixed term",
        eligible: true,
        description: "Highest eligible rate. Funds are locked for the full term.",
    },
];

export const earnPositions = [{
    id: "ep_1",
    productId: "earn_usdt_90",
    name: "USDT 90-Day",
    asset: "USDT",
    principal: 25000,
    apy: 9.6,
    accrued: 418.2,
    startedAt: "2026-07-20T00:00:00Z",
    maturesAt: "2026-10-18T00:00:00Z",
    status: "Active",
}, ];

export const walletBalances = [
    { asset: "USD", name: "US Dollar", type: "fiat", balance: 14260.12, usdValue: 14260.12 },
    { asset: "BTC", name: "Bitcoin", type: "crypto", balance: 0.6421, usdValue: 59613.5 },
    { asset: "USDT", name: "Tether", type: "crypto", balance: 38200.0, usdValue: 38200.0 },
];

export const paymentMethods = [
    { id: "pm_bank", label: "Bank transfer", detail: "1–2 business days", fee: "0.5%" },
    { id: "pm_card", label: "Debit card", detail: "Instant", fee: "1.8%" },
];

export const fiatCurrencies = ["USD", "EUR", "GBP", "NGN"];

export const cards = [{
    id: "card_1",
    label: "Wealth Wallet Virtual",
    brand: "Visa",
    last4: "4821",
    number: "•••• •••• •••• 4821",
    expiry: "09/29",
    cvv: "•••",
    balance: 2480.5,
    currency: "USD",
    status: "Active",
    frozen: false,
    monthlySpend: 962.3,
    limit: 5000,
}, ];

export const cardActivity = [
    { id: "ca_1", cardId: "card_1", merchant: "Apple Store", amount: -129.0, currency: "USD", date: "2026-09-13T11:04:00Z", status: "Completed" },
    { id: "ca_2", cardId: "card_1", merchant: "Uber", amount: -18.4, currency: "USD", date: "2026-09-12T19:22:00Z", status: "Completed" },
];

export const transactionTypes = [
    "Deposit",
    "Withdrawal",
    "Trade",
    "Transfer",
    "Earn",
    "Card",
    "Copy trading",
];

export const transactionStatuses = ["Completed", "Pending", "Failed", "Cancelled"];

export const transactions = [
    { id: "tx_5012", type: "Deposit", description: "Bank transfer deposit", amount: 10000, asset: "USD", status: "Completed", date: "2026-09-13T08:12:00Z" },
    { id: "tx_5011", type: "Trade", description: "Buy NVDA · 20 @ 176.10", amount: -3522, asset: "USD", status: "Completed", date: "2026-09-12T15:44:00Z" },
    { id: "tx_5010", type: "Earn", description: "USDT 90-Day interest accrual", amount: 64.2, asset: "USDT", status: "Completed", date: "2026-09-12T00:00:00Z" },
    { id: "tx_5009", type: "Card", description: "Apple Store · Virtual •4821", amount: -129, asset: "USD", status: "Completed", date: "2026-09-11T11:04:00Z" },
    { id: "tx_5008", type: "Withdrawal", description: "Withdrawal to GTBank ••4402", amount: -2500, asset: "USD", status: "Pending", date: "2026-09-11T09:30:00Z" },
];

export const marketHighlights = [
    { label: "Top gainer", symbol: "SOL", change: 5.42 },
    { label: "Most traded", symbol: "BTC", change: 3.14 },
    { label: "Top loser", symbol: "CL", change: -1.93 },
];