import { parseApiError } from "@/api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUserById } from "@/hooks/useAdminUsers";
import { Link, useParams } from "react-router";

export const AdminUserDetailPage = () => {
  const { id = "" } = useParams();
  const { data: user, isPending, isError, error, refetch } = useAdminUserById(id);

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
    </div>
  );
};
