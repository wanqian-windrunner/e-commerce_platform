import { parseApiError } from "@/api/client";
import { AdminCategoryForm } from "@/components/categories/AdminCategoryForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminCategories, useAdminCategoryById, useUpdateAdminCategory } from "@/hooks/useAdminCategories";
import { toUpdateCategoryPayload, type CategoryFormValues } from "@/lib/validations/category";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export const AdminCategoryEditPage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const categoryQuery = useAdminCategoryById(id);
  const categoriesQuery = useAdminCategories();
  const mutation = useUpdateAdminCategory(id);

  const handleSubmit = (values: CategoryFormValues) => {
    mutation.mutate(toUpdateCategoryPayload(values), {
      onSuccess: () => {
        toast.success("Category updated");
        void navigate(`/admin/categories/${id}`);
      },
      onError: (error) => toast.error(parseApiError(error)),
    });
  };

  if (!id) return <p role="alert" className="text-destructive">Category ID is missing.</p>;

  return (
    <div className="space-y-6">
      <Link to={`/admin/categories/${id}`} className="text-sm underline">Back to category</Link>
      <h1 className="text-2xl font-semibold">Edit category</h1>
      {categoryQuery.isPending || categoriesQuery.isPending ? (
        <Skeleton className="h-64 w-full max-w-xl" />
      ) : categoryQuery.isError || categoriesQuery.isError ? (
        <div role="alert" className="space-y-2 text-destructive">
          <p>{parseApiError(categoryQuery.error ?? categoriesQuery.error)}</p>
          <Button type="button" variant="outline" onClick={() => {
            if (categoryQuery.isError) void categoryQuery.refetch();
            if (categoriesQuery.isError) void categoriesQuery.refetch();
          }}>Retry</Button>
        </div>
      ) : (
        <>
          {mutation.isError && <p role="alert" className="text-sm text-destructive">{parseApiError(mutation.error)}</p>}
          <AdminCategoryForm
            key={categoryQuery.data.id}
            categoryId={id}
            categories={categoriesQuery.data}
            initialValues={{
              name: categoryQuery.data.name,
              slug: categoryQuery.data.slug,
              description: categoryQuery.data.description ?? "",
              parentId: categoryQuery.data.parentId ?? "",
            }}
            submitting={mutation.isPending || categoryQuery.isFetching || categoriesQuery.isFetching}
            submitLabel="Save changes"
            onSubmit={handleSubmit}
          />
        </>
      )}
    </div>
  );
};
