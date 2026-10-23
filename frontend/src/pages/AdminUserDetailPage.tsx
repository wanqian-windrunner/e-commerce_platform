import { parseApiError } from "@/api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUserById, useUpdateAdminUser } from "@/hooks/useAdminUsers";
import { useAuthStore } from "@/stores/authStore";
import type { UserRole } from "@/types/auth";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

export const AdminUserDetailPage = () => {
  const { id = "" } = useParams();
  const { data: user, isPending, isError, isFetching, error, refetch } = useAdminUserById(id);
  const adminId = useAuthStore((state) => state.user?.id);
  const mutation = useUpdateAdminUser(id);

  const handleRoleChange = (role: UserRole) => {
    if (!user || isError || isFetching || mutation.isPending || user.id === adminId || user.role === role) return;
    if (role === "customer" &&
        !window.confirm(`Remove admin access from ${user.name}? This takes effect on their next admin request.`)) return;

    mutation.mutate({ role }, {
      onSuccess: () => toast.success("User role updated"),
      onError: (mutationError) => toast.error(parseApiError(mutationError)),
    });
  };

  const handleActivation = () => {
    if (!user || isError || isFetching || mutation.isPending || user.id === adminId) return;
    if (user.isActive &&
        !window.confirm(`Deactivate ${user.name}? They will be unable to sign in or refresh their session.`)) return;

    mutation.mutate({ isActive: !user.isActive }, {
      onSuccess: () => toast.success(user.isActive ? "User deactivated" : "User reactivated"),
      onError: (mutationError) => toast.error(parseApiError(mutationError)),
    });
  };

  if (!id) return <p role="alert" className="text-destructive">User ID is missing.</p>;
  if (isPending) return <Skeleton className="h-64 w-full" />;
  if (isError) {
    return (
      <div role="alert" className="space-y-3 text-destructive">
        <p>{parseApiError(error)}</p>
        <Button type="button" variant="outline" onClick={() => void refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/users" className="text-sm underline">Back to users</Link>
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">{user.role}</Badge>
            <Badge variant={user.isActive ? "secondary" : "outline"}>
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Email: {user.email}</p>
          <p className="break-all">ID: {user.id}</p>
          <p className="text-muted-foreground">Joined {new Date(user.createdAt).toLocaleString()}</p>
          <p className="text-muted-foreground">Updated {new Date(user.updatedAt).toLocaleString()}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Role</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {user.id === adminId ? (
            <p className="text-sm text-muted-foreground">You cannot change your own admin role.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(["customer", "admin"] as const).map((role) => (
                <Button
                  key={role}
                  type="button"
                  variant={user.role === role ? "secondary" : "outline"}
                  disabled={user.role === role || isFetching || mutation.isPending}
                  onClick={() => handleRoleChange(role)}
                >
                  {mutation.isPending ? "Updating..." : `Set ${role}`}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Account status</CardTitle></CardHeader>
        <CardContent>
          {user.id === adminId ? (
            <p className="text-sm text-muted-foreground">You cannot deactivate your own admin account.</p>
          ) : (
            <Button
              type="button"
              variant={user.isActive ? "destructive" : "outline"}
              disabled={isFetching || mutation.isPending}
              onClick={handleActivation}
            >
              {mutation.isPending ? "Updating..." : user.isActive ? "Deactivate user" : "Reactivate user"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
