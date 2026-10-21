import { getAdminCategories, getAdminCategoryById } from "@/api/admin-categories.api";
import { queryKeys } from "@/lib/queryKeys";
import { useAuthStore } from "@/stores/authStore";
import { useQuery } from "@tanstack/react-query";

export const useAdminCategories = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  return useQuery({
    queryKey: queryKeys.adminCategories.list(user?.id ?? ""),
    queryFn: getAdminCategories,
    select: (response) => response.data,
    enabled: !isLoading && user?.role === "admin",
  });
};

export const useAdminCategoryById = (categoryId: string) => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  return useQuery({
    queryKey: queryKeys.adminCategories.detail(user?.id ?? "", categoryId),
    queryFn: () => getAdminCategoryById(categoryId),
    select: (response) => response.data,
    enabled: !isLoading && user?.role === "admin" && Boolean(categoryId),
  });
};
