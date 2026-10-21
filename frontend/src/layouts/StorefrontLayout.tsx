import { parseApiError } from "@/api/client";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "cn";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";

export const StorefrontLayout = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      await logout();
    } catch (error) {
      setLogoutError(
        `${parseApiError(error)} Your session may still be active on this browser.`,
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-6">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )
            }
          >
            Cart
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )
            }
          >
            My orders
          </NavLink>
          {user?.role === "admin" && (
            <>
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                Manage products
              </NavLink>
              <NavLink
                to="/admin/categories"
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                Manage categories
              </NavLink>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                Manage users
              </NavLink>
            </>
          )}
          <div className="ml-auto flex items-center gap-3">
            {isLoading ? (
              <span className="text-sm text-muted-foreground">
                Checking session...
              </span>
            ) : user ? (
              <>
                <span className="text-sm">{user.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                >
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </Button>
              </>
            ) : (
              <Link to="/login" className="text-sm hover:underline">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>
      {logoutError && (
        <p
          role="alert"
          className="mx-auto w-full max-w-6xl px-4 py-2 text-sm text-destructive"
        >
          {logoutError}
        </p>
      )}
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
