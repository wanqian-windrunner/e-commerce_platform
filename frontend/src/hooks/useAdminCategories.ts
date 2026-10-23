import { createAdminCategory, deactivateAdminCategory, getAdminCategories, getAdminCategoryById, updateAdminCategory } from "@/api/admin-categories.api";
import type { UpdateAdminCategoryPayload } from "@/types/admin-categories";
import { queryKeys } from "@/lib/queryKeys";
import { useAuthStore } from "@/stores/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateAdminCategory = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: createAdminCategory,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.adminCategories.list(user?.id ?? "") }),
        queryClient.invalidateQueries({ queryKey: queryKeys.categories.all }),
      ]);
    },
  });
};

export const useUpdateAdminCategory = (categoryId: string) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (payload: UpdateAdminCategoryPayload) => updateAdminCategory(categoryId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.adminCategories.detail(user?.id ?? "", categoryId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.adminCategories.list(user?.id ?? "") }),
        queryClient.invalidateQueries({ queryKey: queryKeys.categories.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.adminProducts.lists(user?.id ?? "") }),
      ]);
    },
  });
};

export const useDeactivateAdminCategory = (categoryId: string) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: () => deactivateAdminCategory(categoryId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.adminCategories.detail(user?.id ?? "", categoryId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.adminCategories.list(user?.id ?? "") }),
        queryClient.invalidateQueries({ queryKey: queryKeys.categories.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.adminProducts.lists(user?.id ?? "") }),
      ]);
    },
  });
};

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
