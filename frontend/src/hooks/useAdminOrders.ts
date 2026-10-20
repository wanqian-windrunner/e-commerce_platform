import { getAdminOrders } from "@/api/admin-orders.api";
import { queryKeys } from "@/lib/queryKeys";
import { useAuthStore } from "@/stores/authStore";
import type { AdminOrderListParams } from "@/types/admin-orders";
import { useQuery } from "@tanstack/react-query";

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