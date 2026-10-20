import { apiClient } from "@/api/client";
import type { AdminOrderListParams, AdminOrderListResult } from "@/types/admin-orders";
import type { ApiResponse } from "@/types/common";

export const getAdminOrders = async (params?: AdminOrderListParams): Promise<ApiResponse<AdminOrderListResult>> => {
    const response = await apiClient.get<ApiResponse<AdminOrderListResult>>("/api/admin/orders", { params })
    return response.data
}