export const currency = (value, code = "USD", opts = {}) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: code,
        minimumFractionDigits: opts.minimumFractionDigits !== undefined ?
            opts.minimumFractionDigits :
            opts.maximumFractionDigits !== undefined ?
            opts.maximumFractionDigits :
            2,
        maximumFractionDigits: opts.maximumFractionDigits !== undefined ? opts.maximumFractionDigits : 2,
    }).format(Number(value == null ? 0 : value));

export const compact = (value) =>
    new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(
        Number(value == null ? 0 : value),
    );

export const number = (value, digits = 2) =>
    new Intl.NumberFormat("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(Number(value == null ? 0 : value));

export const percent = (value, digits = 2) =>
    `${value > 0 ? "+" : ""}${number(value, digits)}%`;

export const shortDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const dateTime = (iso) =>
    new Date(iso).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());

export const cx = (...parts) => parts.filter(Boolean).join(" ");