import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import MobileNav from "./MobileNav.jsx";

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setDrawerOpen(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <div className="mx-auto flex w-full max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">
          <Sidebar />
        </aside>

        <div className="min-w-0 flex-1">
          <Header onOpenMenu={() => setDrawerOpen(true)} />
          <main className="animate-rise px-4 pb-24 pt-20 sm:pt-16 lg:px-8 lg:pb-12 lg:pt-5">
            <Outlet />
          </main>
        </div>
      </div>

      <MobileNav onMore={() => setDrawerOpen(true)} />

      {drawerOpen && (
        <div className="fixed inset-0 z-80 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-[2px]"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <div className="animate-rise absolute inset-y-0 left-0 w-[78%] max-w-72">
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
