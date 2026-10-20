import { useState, type SubmitEvent } from "react";
import { parseApiError } from "@/api/client";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

export const ProductsPage = () => {
  const [draftSearch, setDraftSearch] = useState("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const { data: categories, isError: isCategoriesError, error: categoriesError } = useCategories();
  const { data, isPending, isError, error } = useProducts({
    page,
    limit: 12,
    search: search || undefined,
    categoryId: categoryId || undefined,
  });

  const handleSearch = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(draftSearch.trim());
    setPage(1);
  };

  const clearSearch = () => {
    setDraftSearch("");
    setSearch("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        Products
        {data && (
          <span className="ml-2 text-sm text-muted-foreground">
            {data.pagination.total} items
          </span>
        )}
      </h1>

      <form onSubmit={handleSearch} className="flex max-w-lg gap-2" role="search">
        <Input
          aria-label="Search products"
          type="search"
          value={draftSearch}
          onChange={(event) => setDraftSearch(event.target.value)}
          placeholder="Search products"
        />
        <Button type="submit">Search</Button>
        {search && (
          <Button type="button" variant="outline" onClick={clearSearch}>
            Clear
          </Button>
        )}
      </form>

      <div className="space-y-1">
        <label htmlFor="category-filter" className="block text-sm font-medium">
          Category
        </label>
        <select
          id="category-filter"
          className="h-9 w-full max-w-xs rounded-md border border-input bg-background px-3 text-sm"
          value={categoryId}
          disabled={!categories || isCategoriesError}
          onChange={(event) => {
            setCategoryId(event.target.value);
            setPage(1);
          }}
        >
          <option value="">All categories</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        {isCategoriesError && (
          <p role="alert" className="text-sm text-destructive">
            Categories unavailable: {parseApiError(categoriesError)}
          </p>
        )}
      </div>

      {isPending ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-4/3 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <p role="alert" className="text-destructive">{parseApiError(error)}</p>
      ) : (
        <>
          {data.products.length === 0 ? (
            <p className="text-muted-foreground">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {data.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {data.pagination.total > 0 && (
            <div className="flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                disabled={!data.pagination.hasPreviousPage}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.pagination.page} of {data.pagination.totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                disabled={!data.pagination.hasNextPage}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
