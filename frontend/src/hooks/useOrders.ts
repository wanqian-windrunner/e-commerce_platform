import { createOrder } from "@/api/order.api";
import { queryKeys } from "@/lib/queryKeys";
import { useAuthStore } from "@/stores/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
