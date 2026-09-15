/**
 * API SERVICE PLACEHOLDERS
 * ------------------------
 * Every function here returns mock data today. The backend developer should
 * replace the body of each function with a real `request()` call — the
 * signatures and returned shapes are the contract the UI depends on.
 *
 * Example replacement:
 *   export const getPortfolio = () => request("/portfolio");
 */
import {
  portfolio,
  allocation,
  portfolioSeries,
  assets,
  positions,
  orders,
  traders,
  earnProducts,
  earnPositions,
  walletBalances,
  transactions,
  cards,
  cardActivity,
  user,
  paymentMethods,
} from "../data/mockData.js";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

/** Generic fetch wrapper — ready for real endpoints. */
export async function request(path, { method = "GET", body, token, signal } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(detail || `Request failed with status ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

const delay = (data, ms = 320) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

/* ----------------------------- auth (frontend only) ---------------------- */
/**
 * INTEGRATION POINT: the backend owns authentication.
 * The frontend only collects an email address and hands it over.
 */
export const submitEmail = (email) => delay({ email, status: "submitted" }, 700);

/* ------------------------------- account --------------------------------- */
export const getUser = () => delay(user);

/* ------------------------------ portfolio -------------------------------- */
export const getPortfolio = () => delay(portfolio);
export const getAllocation = () => delay(allocation);
export const getPortfolioSeries = (range = "1M") => delay(portfolioSeries[range] ?? portfolioSeries["1M"]);

/* ------------------------------- markets --------------------------------- */
export const getAssets = (category = "all") =>
  delay(category === "all" ? assets : assets.filter((a) => a.category === category));
export const getAsset = (symbol) => delay(assets.find((a) => a.symbol === symbol) ?? null);

/* -------------------------------- trading -------------------------------- */
export const getPositions = () => delay(positions);
export const getOrders = () => delay(orders);
export const placeOrder = (payload) => delay({ ...payload, id: `demo-${Date.now()}`, status: "pending" }, 800);

/* ------------------------------ copy trading ----------------------------- */
export const getTraders = () => delay(traders);
export const getTrader = (id) => delay(traders.find((t) => t.id === id) ?? null);
export const startCopying = (payload) => delay({ ...payload, status: "pending" }, 800);

/* ---------------------------------- earn --------------------------------- */
export const getEarnProducts = () => delay(earnProducts);
export const getEarnPositions = () => delay(earnPositions);
export const subscribeToEarn = (payload) => delay({ ...payload, status: "pending" }, 800);

/* --------------------------------- wallet -------------------------------- */
export const getWalletBalances = () => delay(walletBalances);
export const getPaymentMethods = () => delay(paymentMethods);
export const createDeposit = (payload) => delay({ ...payload, status: "pending" }, 900);
export const createWithdrawal = (payload) => delay({ ...payload, status: "pending" }, 900);

/* --------------------------------- cards --------------------------------- */
export const getCards = () => delay(cards);
export const getCardActivity = (cardId) =>
  delay(cardActivity.filter((item) => item.cardId === cardId));
export const setCardFrozen = (cardId, frozen) => delay({ cardId, frozen }, 500);

/* ----------------------------- transactions ------------------------------ */
export const getTransactions = () => delay(transactions);
