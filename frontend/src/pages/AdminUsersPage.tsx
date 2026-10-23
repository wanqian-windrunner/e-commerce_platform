import { parseApiError } from "@/api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";

export const AdminUsersPage = () => {
  const [page, setPage] = useState(1);
  const [draftSearch, setDraftSearch] = useState("");
  const [search, setSearch] = useState("");
  const { data, isPending, isError, error, refetch } = useAdminUsers({
    page,
    limit: 20,
    search: search || undefined,
  });

  const handleSearch = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(draftSearch.trim());
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Manage users</h1>
      <form role="search" onSubmit={handleSearch} className="flex max-w-lg gap-2">
        <Input
          type="search"
          aria-label="Search users"
          value={draftSearch}
          onChange={(event) => setDraftSearch(event.target.value)}
          placeholder="Name or email"
        />
        <Button type="submit">Search</Button>
      </form>

      {isPending ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : isError ? (
        <div role="alert" className="space-y-2 text-destructive">
          <p>{parseApiError(error)}</p>
          <Button type="button" variant="outline" onClick={() => void refetch()}>Retry</Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{data.pagination.total} users</p>
          {data.data.length === 0 ? (
            <p className="text-muted-foreground">No users found.</p>
          ) : (
            <ul className="space-y-3">
              {data.data.map((user) => (
                <li key={user.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex flex-wrap items-center gap-2">
                        <span>{user.name}</span>
                        <Badge variant="secondary">{user.role}</Badge>
                        <Badge variant={user.isActive ? "secondary" : "outline"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center justify-between gap-3 text-sm">
                      <div className="space-y-1 text-muted-foreground">
                        <p>{user.email}</p>
                        <p>Joined {new Date(user.createdAt).toLocaleString()}</p>
                        <p className="break-all">ID: {user.id}</p>
                      </div>
                      <Link to={`/admin/users/${user.id}`} className="underline">View details</Link>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
          {data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
              >Previous</Button>
              <span className="text-sm text-muted-foreground">
                Page {data.pagination.page} of {data.pagination.totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                disabled={page >= data.pagination.totalPages}
                onClick={() => setPage((current) => current + 1)}
              >Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
