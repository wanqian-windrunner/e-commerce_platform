import { parseApiError } from "@/api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminProductById, useDeactivateAdminProduct, useUpdateAdminProduct } from "@/hooks/useAdminProducts";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

export const AdminProductDetailPage = () => {
  const { id = "" } = useParams();
  const { data: product, isPending, isError, isFetching, error, refetch } = useAdminProductById(id);
  const deactivateMutation = useDeactivateAdminProduct(id);
  const updateMutation = useUpdateAdminProduct(id);

  const handleToggle = () => {
    if (!product || isError || isFetching || deactivateMutation.isPending || updateMutation.isPending) return;

    if (product.isActive) {
      if (!window.confirm(`Take ${product.name} offline? It will no longer appear in the store.`)) return;
      deactivateMutation.mutate(undefined, {
        onSuccess: () => toast.success("Product deactivated"),
        onError: (mutationError) => toast.error(parseApiError(mutationError)),
      });
    } else {
      updateMutation.mutate({ isActive: true }, {
        onSuccess: () => toast.success("Product reactivated"),
        onError: (mutationError) => toast.error(parseApiError(mutationError)),
      });
    }
  };

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/products" className="text-sm underline">Back to products</Link>
        <Link to={`/admin/products/${product.id}/edit`} className="text-sm underline">Edit product</Link>
      </div>
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">{product.name}</CardTitle>
          <Badge variant={product.isActive ? "secondary" : "outline"} className="w-fit">
            {product.isActive ? "Active" : "Inactive"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="h-48 max-w-full rounded-md object-contain" />}
          <p>SKU: {product.sku}</p>
          <p>Category: {product.category?.name ?? "Uncategorized"}</p>
          <p>Price: {product.price}</p>
          <p>Stock: {product.stock}</p>
          <p>Description: {product.description || "—"}</p>
          <p className="text-muted-foreground">Created {new Date(product.createdAt).toLocaleString()}</p>
        </CardContent>
      </Card>
      <Button
        type="button"
        variant={product.isActive ? "destructive" : "outline"}
        disabled={isFetching || deactivateMutation.isPending || updateMutation.isPending}
        onClick={handleToggle}
      >
        {deactivateMutation.isPending || updateMutation.isPending
          ? "Updating..."
          : product.isActive ? "Deactivate product" : "Reactivate product"}
      </Button>
    </div>
  );
};
