import { parseApiError } from "@/api/client";
import { AdminProductForm } from "@/components/products/AdminProductForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminProductById, useUpdateAdminProduct } from "@/hooks/useAdminProducts";
import { useAdminCategories } from "@/hooks/useAdminCategories";
import { toProductPayload, type ProductFormValues } from "@/lib/validations/product";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export const AdminProductEditPage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const productQuery = useAdminProductById(id);
  const categoriesQuery = useAdminCategories();
  const mutation = useUpdateAdminProduct(id);

  const handleSubmit = (values: ProductFormValues) => {
    mutation.mutate(toProductPayload(values), {
      onSuccess: () => {
        toast.success("Product updated");
        void navigate(`/admin/products/${id}`);
      },
      onError: (error) => toast.error(parseApiError(error)),
    });
  };

  if (!id) return <p role="alert" className="text-destructive">Product ID is missing.</p>;

  return (
    <div className="space-y-6">
      <Link to={`/admin/products/${id}`} className="text-sm underline">Back to product</Link>
      <h1 className="text-2xl font-semibold">Edit product</h1>
      {productQuery.isPending || categoriesQuery.isPending ? (
        <Skeleton className="h-64 w-full max-w-xl" />
      ) : productQuery.isError || categoriesQuery.isError ? (
        <div role="alert" className="space-y-2 text-destructive">
          <p>{parseApiError(productQuery.error ?? categoriesQuery.error)}</p>
          <Button type="button" variant="outline" onClick={() => {
            if (productQuery.isError) void productQuery.refetch();
            if (categoriesQuery.isError) void categoriesQuery.refetch();
          }}>Retry</Button>
        </div>
      ) : (
        <>
          {mutation.isError && <p role="alert" className="text-sm text-destructive">{parseApiError(mutation.error)}</p>}
          <AdminProductForm
            key={productQuery.data.id}
            categories={categoriesQuery.data}
            initialValues={{
              name: productQuery.data.name,
              sku: productQuery.data.sku,
              categoryId: productQuery.data.categoryId ?? "",
              description: productQuery.data.description ?? "",
              price: productQuery.data.price,
              stock: String(productQuery.data.stock),
              imageUrl: productQuery.data.imageUrl ?? "",
              isActive: productQuery.data.isActive,
            }}
            submitting={mutation.isPending || productQuery.isFetching}
            submitLabel="Save changes"
            onSubmit={handleSubmit}
          />
        </>
      )}
    </div>
  );
};
