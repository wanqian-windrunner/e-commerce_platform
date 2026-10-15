import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet, useLocation } from "react-router";

export const ProtectedRoute = () => {
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (isLoading) {
    return <div className="py-8 text-sm text-muted-foreground">Checking session...</div>;
  }

  if (!user) {
    return (
        <Navigate to="/login" replace state={{from: `${location.pathname}${location.search}${location.hash}`}} />
    )
  }
  return <Outlet />
};
