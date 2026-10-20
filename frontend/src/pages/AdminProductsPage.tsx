import { parseApiError } from "@/api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";

export const AdminProductsPage = () => {
  const [page, setPage] = useState(1);
  const [draftSearch, setDraftSearch] = useState("");
  const [search, setSearch] = useState("");
  const [includeInactive, setIncludeInactive] = useState(true);
  const { data, isPending, isError, error, refetch } = useAdminProducts({
    page,
    limit: 10,
    search: search || undefined,
    includeInactive,
  });

  const handleSearch = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(draftSearch.trim());
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Manage products</h1>
      </div>

      <form role="search" onSubmit={handleSearch} className="flex max-w-lg gap-2">
        <Input
          type="search"
          aria-label="Search managed products"
          value={draftSearch}
          onChange={(event) => setDraftSearch(event.target.value)}
          placeholder="Name, SKU, or description"
        />
        <Button type="submit">Search</Button>
      </form>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={includeInactive}
          onChange={(event) => {
            setIncludeInactive(event.target.checked);
            setPage(1);
          }}
        />
        Include inactive products
      </label>

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
          <p className="text-sm text-muted-foreground">{data.pagination.total} products</p>
          {data.products.length === 0 ? (
            <p className="text-muted-foreground">No products found.</p>
          ) : (
            <ul className="space-y-3">
              {data.products.map((product) => (
                <li key={product.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex flex-wrap items-center gap-2">
                        <span>{product.name}</span>
                        <Badge variant={product.isActive ? "secondary" : "outline"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center justify-between gap-3 text-sm">
                      <div className="space-y-1 text-muted-foreground">
                        <p>SKU: {product.sku} · {product.category?.name ?? "Uncategorized"}</p>
                        <p>Price: {product.price} · Stock: {product.stock}</p>
                      </div>
                      <Link to={`/admin/products/${product.id}`} className="underline">View details</Link>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
          {data.pagination.total > 0 && (
            <div className="flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                disabled={!data.pagination.hasPreviousPage}
                onClick={() => setPage((current) => current - 1)}
              >Previous</Button>
              <span className="text-sm text-muted-foreground">
                Page {data.pagination.page} of {data.pagination.totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                disabled={!data.pagination.hasNextPage}
                onClick={() => setPage((current) => current + 1)}
              >Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
