import { useState, type SubmitEvent } from "react";
import { parseApiError } from "@/api/client";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import type { ProductListParams } from "@/types/products";

const sortOptions = {
  newest: { sortBy: "createdAt", sortOrder: "desc" },
  priceLow: { sortBy: "price", sortOrder: "asc" },
  priceHigh: { sortBy: "price", sortOrder: "desc" },
  nameAsc: { sortBy: "name", sortOrder: "asc" },
} as const satisfies Record<string, Pick<ProductListParams, "sortBy" | "sortOrder">>;

type SortOption = keyof typeof sortOptions;

export const ProductsPage = () => {
  const [draftSearch, setDraftSearch] = useState("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [draftMinPrice, setDraftMinPrice] = useState("");
  const [draftMaxPrice, setDraftMaxPrice] = useState("");
  const [priceFilter, setPriceFilter] = useState<Pick<ProductListParams, "minPrice" | "maxPrice">>({});
  const [priceError, setPriceError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { data: categories, isError: isCategoriesError, error: categoriesError } = useCategories();
  const { data, isPending, isError, error } = useProducts({
    page,
    limit: 12,
    search: search || undefined,
    categoryId: categoryId || undefined,
    ...sortOptions[sortOption],
    ...priceFilter,
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

  const applyPriceFilter = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const minInput = draftMinPrice.trim();
    const maxInput = draftMaxPrice.trim();
    const minPrice = minInput === "" ? undefined : Number(minInput);
    const maxPrice = maxInput === "" ? undefined : Number(maxInput);
    const minField = event.currentTarget.elements.namedItem("min-price") as HTMLInputElement;
    const maxField = event.currentTarget.elements.namedItem("max-price") as HTMLInputElement;

    if (
      minField.validity.badInput ||
      maxField.validity.badInput ||
      (minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) ||
      (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0))
    ) {
      setPriceError("Enter valid non-negative prices.");
      return;
    }
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      setPriceError("Minimum price cannot be greater than maximum price.");
      return;
    }

    setPriceError(null);
    setPriceFilter({ minPrice, maxPrice });
    setPage(1);
  };

  const clearPriceFilter = () => {
    setDraftMinPrice("");
    setDraftMaxPrice("");
    setPriceFilter({});
    setPriceError(null);
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

      <div className="flex flex-wrap gap-4">
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

        <div className="space-y-1">
          <label htmlFor="product-sort" className="block text-sm font-medium">
            Sort by
          </label>
          <select
            id="product-sort"
            className="h-9 w-full max-w-xs rounded-md border border-input bg-background px-3 text-sm"
            value={sortOption}
            onChange={(event) => {
              setSortOption(event.target.value as SortOption);
              setPage(1);
            }}
          >
            <option value="newest">Newest</option>
            <option value="priceLow">Price: low to high</option>
            <option value="priceHigh">Price: high to low</option>
            <option value="nameAsc">Name: A–Z</option>
          </select>
        </div>
      </div>

      <form onSubmit={applyPriceFilter} noValidate className="space-y-2">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label htmlFor="min-price" className="block text-sm font-medium">
              Minimum price
            </label>
            <Input
              id="min-price"
              type="number"
              min="0"
              step="0.01"
              className="w-32"
              value={draftMinPrice}
              onChange={(event) => setDraftMinPrice(event.target.value)}
              aria-invalid={Boolean(priceError)}
              aria-describedby={priceError ? "price-error" : undefined}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="max-price" className="block text-sm font-medium">
              Maximum price
            </label>
            <Input
              id="max-price"
              type="number"
              min="0"
              step="0.01"
              className="w-32"
              value={draftMaxPrice}
              onChange={(event) => setDraftMaxPrice(event.target.value)}
              aria-invalid={Boolean(priceError)}
              aria-describedby={priceError ? "price-error" : undefined}
            />
          </div>
          <Button type="submit">Apply price</Button>
          <Button type="button" variant="outline" onClick={clearPriceFilter}>
            Clear price
          </Button>
        </div>
        {priceError && (
          <p id="price-error" role="alert" className="text-sm text-destructive">
            {priceError}
          </p>
        )}
      </form>

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
