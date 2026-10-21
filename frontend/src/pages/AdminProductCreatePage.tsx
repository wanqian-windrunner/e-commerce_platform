import { parseApiError } from "@/api/client";
import { AdminProductForm } from "@/components/products/AdminProductForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateAdminProduct } from "@/hooks/useAdminProducts";
import { useCategories } from "@/hooks/useCategories";
import { toProductPayload, type ProductFormValues } from "@/lib/validations/product";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export const AdminProductCreatePage = () => {
  const navigate = useNavigate();
  const categoriesQuery = useCategories();
  const mutation = useCreateAdminProduct();

  const handleSubmit = (values: ProductFormValues) => {
    mutation.mutate(toProductPayload(values), {
      onSuccess: (response) => {
        toast.success("Product created");
        void navigate(`/admin/products/${response.data.product.id}`);
      },
      onError: (error) => toast.error(parseApiError(error)),
    });
  };

  return (
    <div className="space-y-6">
      <Link to="/admin/products" className="text-sm underline">Back to products</Link>
      <h1 className="text-2xl font-semibold">Add product</h1>
      {categoriesQuery.isPending ? (
        <Skeleton className="h-64 w-full max-w-xl" />
      ) : categoriesQuery.isError ? (
        <div role="alert" className="space-y-2 text-destructive">
          <p>Categories unavailable: {parseApiError(categoriesQuery.error)}</p>
          <Button type="button" variant="outline" onClick={() => void categoriesQuery.refetch()}>Retry</Button>
        </div>
      ) : categoriesQuery.data.length === 0 ? (
        <p role="alert">Create a <Link to="/admin/categories/new" className="underline">category</Link> before adding a product.</p>
      ) : (
        <>
          {mutation.isError && <p role="alert" className="text-sm text-destructive">{parseApiError(mutation.error)}</p>}
          <AdminProductForm
            categories={categoriesQuery.data}
            submitting={mutation.isPending}
            submitLabel="Create product"
            onSubmit={handleSubmit}
          />
        </>
      )}
    </div>
  );
};
