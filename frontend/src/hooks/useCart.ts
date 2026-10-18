import {
  addCartItem,
  clearCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "@/api/cart.api";
import { queryKeys } from "@/lib/queryKeys";
import { useAuthStore } from "@/stores/authStore";
import type { AddCartItemPayload } from "@/types/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCart = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  return useQuery({
    queryKey: queryKeys.cart.byUser(user?.id ?? ""),
    queryFn: getCart,
    select: (res) => res.data,
    enabled: !isLoading && Boolean(user),
    staleTime: 0,
  });
};

export const useAddCartItem = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: addCartItem,
    onSuccess: () => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.cart.byUser(user.id),
        });
      }
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: ({ productId, quantity }: AddCartItemPayload) =>
      updateCartItem(productId, quantity),
    onSuccess: () => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.cart.byUser(user.id),
        });
      }
    },
  });
};

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.cart.byUser(user.id),
        });
      }
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.cart.byUser(user.id),
        });
      }
    },
  });
};
