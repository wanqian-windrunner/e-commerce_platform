import { createOrder, getOrderById, getOrders } from "@/api/order.api";
import type { OrderListParams } from "@/types/orders";
import { queryKeys } from "@/lib/queryKeys";
import { useAuthStore } from "@/stores/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      if (user) {
        void queryClient.invalidateQueries({queryKey: queryKeys.cart.byUser(user.id)});
        void queryClient.invalidateQueries({queryKey: queryKeys.products.all})
        void queryClient.invalidateQueries({queryKey: queryKeys.order.lists(user.id)})
      }
    },
  });
};

export const useOrderById = (orderId:string) => {
    const user = useAuthStore((state) => state.user)
    const isLoading = useAuthStore((state) => state.isLoading)

  return useQuery({
    queryKey : queryKeys.order.byUser(user?.id ?? "", orderId),
    queryFn: () => getOrderById(orderId),
    select: (res) => res.data, 
    enabled: !isLoading && Boolean(user) && Boolean(orderId),
  })
}

export const useOrders = (params?: OrderListParams) => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  return useQuery({
    queryKey: queryKeys.order.list(user?.id ?? "", params),
    queryFn: () => getOrders(params),
    select: (res) => res.data,
    enabled: !isLoading && Boolean(user),
  });
};