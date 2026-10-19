import { apiClient } from "@/api/client";
import type { ApiResponse } from "@/types/common";
import type { CreatedOrder, CreateOrderPayload, OrderDetail } from "@/types/orders";

export const createOrder = async (input: CreateOrderPayload):Promise<ApiResponse<CreatedOrder>> => {
    const response = await apiClient.post<ApiResponse<CreatedOrder>>("/api/orders", input)
    return response.data
}

export const getOrderById = async (id: string): Promise<ApiResponse<OrderDetail>> => {
    const response = await apiClient.get<ApiResponse<OrderDetail>>(`/api/orders/${id}`)
    return response.data
}
