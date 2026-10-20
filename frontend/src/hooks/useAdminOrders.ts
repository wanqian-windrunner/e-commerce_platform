import { getAdminOrderById, getAdminOrders, updateAdminOrderStatus } from "@/api/admin-orders.api";
import { queryKeys } from "@/lib/queryKeys";
import { useAuthStore } from "@/stores/authStore";
import type { AdminOrderListParams, UpdateAdminOrderStatusPayload } from "@/types/admin-orders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAdminOrderById = (orderId: string) => {
    const user = useAuthStore((state) => state.user)
    const isLoading = useAuthStore((state) => state.isLoading)

    return useQuery({
        queryKey: queryKeys.adminOrder.byId(user?.id ?? "", orderId),
        queryFn: () => getAdminOrderById(orderId),
        select: (response) => response.data,
        enabled: !isLoading && user?.role === "admin" && Boolean(orderId),
        refetchOnMount: "always",
    })
}

export const useUpdateAdminOrderStatus = (orderId: string) => {
    const queryClient = useQueryClient()
    const user = useAuthStore((state) => state.user)

    return useMutation({
        mutationFn: (payload: UpdateAdminOrderStatusPayload) => updateAdminOrderStatus(orderId, payload),
        onSuccess: (_response, payload) => {
            if (payload.status === "cancelled") {
                void queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
            }
        },
        onSettled: async () => {
            if (user?.role === "admin") {
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: queryKeys.adminOrder.byId(user.id, orderId) }),
                    queryClient.invalidateQueries({ queryKey: queryKeys.adminOrder.lists(user.id) }),
                ])
            }
        },
    })
}

export const useAdminOrders = (params:AdminOrderListParams) => {
    const user = useAuthStore((state) => state.user)
    const isLoading = useAuthStore((state) => state.isLoading)


    return useQuery({
        queryKey: queryKeys.adminOrder.all(user?.id ?? "", params),
        queryFn: (() => getAdminOrders(params)),
        select: (response) => response.data,
        enabled: !isLoading && user?.role === "admin"
    })

}