import { parseApiError } from "@/api/client";
import { AdminCategoryForm } from "@/components/categories/AdminCategoryForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminCategories, useCreateAdminCategory } from "@/hooks/useAdminCategories";
import { toCreateCategoryPayload, type CategoryFormValues } from "@/lib/validations/category";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export const AdminCategoryCreatePage = () => {
  const navigate = useNavigate();
  const categoriesQuery = useAdminCategories();
  const mutation = useCreateAdminCategory();

  const handleSubmit = (values: CategoryFormValues) => {
    mutation.mutate(toCreateCategoryPayload(values), {
      onSuccess: (response) => {
        toast.success("Category created");
        void navigate(`/admin/categories/${response.data.id}`);
      },
      onError: (error) => toast.error(parseApiError(error)),
    });
  };

  return (
    <div className="space-y-6">
      <Link to="/admin/categories" className="text-sm underline">Back to categories</Link>
      <h1 className="text-2xl font-semibold">Add category</h1>
      {categoriesQuery.isPending ? (
        <Skeleton className="h-64 w-full max-w-xl" />
      ) : categoriesQuery.isError ? (
        <div role="alert" className="space-y-2 text-destructive">
          <p>{parseApiError(categoriesQuery.error)}</p>
          <Button type="button" variant="outline" onClick={() => void categoriesQuery.refetch()}>Retry</Button>
        </div>
      ) : (
        <>
          {mutation.isError && <p role="alert" className="text-sm text-destructive">{parseApiError(mutation.error)}</p>}
          <AdminCategoryForm
            categories={categoriesQuery.data}
            submitting={mutation.isPending}
            submitLabel="Create category"
            onSubmit={handleSubmit}
          />
        </>
      )}
    </div>
  );
};
