import { cn } from "cn";
import { Link, NavLink, Outlet } from "react-router";

export const StorefrontLayout = () => {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-6">
          <NavLink to="/products"
            className={({ isActive }) =>
              cn("rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )
            }
          >
            Products
          </NavLink>
          <Link to="/login">Sign in</Link>
          {/* 品牌 Link · 导航 NavLink · 右侧(登录/购物车) */}
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground">
            © 2026 Shop
        </div>
      </footer>
    </div>
  );
};
