import { createAdminProduct, getAdminProductById, getAdminProducts } from "@/api/admin-products.api";
import { queryKeys } from "@/lib/queryKeys";
import { useAuthStore } from "@/stores/authStore";
import type { ProductListParams } from "@/types/products";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateAdminProduct = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: createAdminProduct,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.adminProducts.lists(user?.id ?? "") }),
        queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
      ]);
    },
  });
};

export const useAdminProducts = (params?: ProductListParams) => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  return useQuery({
    queryKey: queryKeys.adminProducts.list(user?.id ?? "", params),
    queryFn: () => getAdminProducts(params),
    select: (response) => response.data,
    enabled: !isLoading && user?.role === "admin",
  });
};

export const useAdminProductById = (productId: string) => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  return useQuery({
    queryKey: queryKeys.adminProducts.detail(user?.id ?? "", productId),
    queryFn: () => getAdminProductById(productId),
    select: (response) => response.data.product,
    enabled: !isLoading && user?.role === "admin" && Boolean(productId),
  });
};
