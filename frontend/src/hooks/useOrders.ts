import { createOrder, getOrderById } from "@/api/order.api";
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