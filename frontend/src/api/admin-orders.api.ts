import { apiClient } from "@/api/client";
import type { AdminOrderDetail, AdminOrderListParams, AdminOrderListResult, UpdateAdminOrderStatusPayload, UpdatedAdminOrder } from "@/types/admin-orders";
import type { ApiResponse } from "@/types/common";

export const getAdminOrders = async (params?: AdminOrderListParams): Promise<ApiResponse<AdminOrderListResult>> => {
    const response = await apiClient.get<ApiResponse<AdminOrderListResult>>("/api/admin/orders", { params })
    return response.data
}

export const getAdminOrderById = async (id: string): Promise<ApiResponse<AdminOrderDetail>> => {
    const response = await apiClient.get<ApiResponse<AdminOrderDetail>>(`/api/admin/orders/${id}`)
    return response.data
}

export const updateAdminOrderStatus = async (
    id: string,
    payload: UpdateAdminOrderStatusPayload,
): Promise<ApiResponse<UpdatedAdminOrder>> => {
    const response = await apiClient.patch<ApiResponse<UpdatedAdminOrder>>(
        `/api/admin/orders/${id}/status`,
        payload,
    )
    return response.data
}