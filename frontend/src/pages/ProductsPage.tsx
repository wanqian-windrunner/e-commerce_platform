import { parseApiError } from "@/api/client";
import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";

export const ProductsPage = () => {
  const {data, isPending, isError, error} = useProducts({ page: 1, limit: 12 })
  if (isPending) return (
    <div className="p-8">
      <Skeleton className="mb-6 h-8 w-48" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-4/3 rounded-xl" />
        ))}
      </div>
    </div>
  )
  if (isError) return <div className="p-8 text-destructive">{parseApiError(error)}</div>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">
        Products
        <span className="ml-2 text-sm text-muted-foreground">
          {data.pagination.total} items
        </span>
      </h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {data.products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

    </div>
  )
};
