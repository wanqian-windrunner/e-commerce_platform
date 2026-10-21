import { parseApiError } from "@/api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminCategories } from "@/hooks/useAdminCategories";
import { Link } from "react-router";

export const AdminCategoriesPage = () => {
  const { data: categories, isPending, isError, error, refetch } = useAdminCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Manage categories</h1>
      </div>
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
          <p className="text-sm text-muted-foreground">{categories.length} categories, including inactive</p>
          {categories.length === 0 ? (
            <p className="text-muted-foreground">No categories yet.</p>
          ) : (
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex flex-wrap items-center gap-2">
                        <span>{category.name}</span>
                        <Badge variant={category.isActive ? "secondary" : "outline"}>
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center justify-between gap-3 text-sm">
                      <div className="space-y-1 text-muted-foreground">
                        <p>Slug: {category.slug}</p>
                        <p>Parent: {categories.find((parent) => parent.id === category.parentId)?.name ?? "None"}</p>
                      </div>
                      <Link to={`/admin/categories/${category.id}`} className="underline">View details</Link>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};
