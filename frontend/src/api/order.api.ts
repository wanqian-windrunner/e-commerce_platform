import { apiClient } from "@/api/client";
import type { ApiResponse } from "@/types/common";
import type { CreatedOrder, CreateOrderPayload, OrderDetail, OrderListParams, OrderListResult } from "@/types/orders";

export const createOrder = async (input: CreateOrderPayload):Promise<ApiResponse<CreatedOrder>> => {
    const response = await apiClient.post<ApiResponse<CreatedOrder>>("/api/orders", input)
    return response.data
}

export const getOrderById = async (id: string): Promise<ApiResponse<OrderDetail>> => {
    const response = await apiClient.get<ApiResponse<OrderDetail>>(`/api/orders/${id}`)
    return response.data
}

export const getOrders = async (params?: OrderListParams): Promise<ApiResponse<OrderListResult>> => {
    const response = await apiClient.get<ApiResponse<OrderListResult>>("/api/orders", { params })
    return response.data
}
