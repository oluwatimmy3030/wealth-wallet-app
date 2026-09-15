import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Markets from "./pages/Markets.jsx";
import Trade from "./pages/Trade.jsx";
import CopyTrading from "./pages/CopyTrading.jsx";
import Earn from "./pages/Earn.jsx";
import Wallet from "./pages/Wallet.jsx";
import Deposit from "./pages/Deposit.jsx";
import Withdraw from "./pages/Withdraw.jsx";
import Cards from "./pages/Cards.jsx";
import Transactions from "./pages/Transactions.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";

/**
 * Routing only. Authentication is owned by the backend — the app routes are
 * open during development so the interface can be built and reviewed.
 * Wrap <AppLayout /> in a real guard once auth is connected.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/trade/:symbol" element={<Trade />} />
        <Route path="/copy-trading" element={<CopyTrading />} />
        <Route path="/earn" element={<Earn />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/wallet/deposit" element={<Deposit />} />
        <Route path="/wallet/withdraw" element={<Withdraw />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
