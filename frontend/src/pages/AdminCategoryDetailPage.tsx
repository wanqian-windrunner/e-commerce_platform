import { parseApiError } from "@/api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminCategories, useAdminCategoryById } from "@/hooks/useAdminCategories";
import { Link, useParams } from "react-router";

export const AdminCategoryDetailPage = () => {
  const { id = "" } = useParams();
  const { data: category, isPending, isError, error, refetch } = useAdminCategoryById(id);
  const { data: categories } = useAdminCategories();

  if (!id) return <p role="alert" className="text-destructive">Category ID is missing.</p>;
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
      <Link to="/admin/categories" className="text-sm underline">Back to categories</Link>
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">{category.name}</CardTitle>
          <Badge variant={category.isActive ? "secondary" : "outline"} className="w-fit">
            {category.isActive ? "Active" : "Inactive"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Slug: {category.slug}</p>
          <p>Parent: {categories?.find((parent) => parent.id === category.parentId)?.name ?? (category.parentId || "None")}</p>
          <p>Description: {category.description || "—"}</p>
          <p className="text-muted-foreground">Created {new Date(category.createdAt).toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  );
};
