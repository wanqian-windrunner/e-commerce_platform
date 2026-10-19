import { apiClient } from "@/api/client";
import type { ApiResponse } from "@/types/common";
import type { CreatedOrder, CreateOrderPayload } from "@/types/orders";

export const createOrder = async (input: CreateOrderPayload):Promise<ApiResponse<CreatedOrder>> => {
    const response = await apiClient.post<ApiResponse<CreatedOrder>>("/api/orders", input)
    return response.data
}
