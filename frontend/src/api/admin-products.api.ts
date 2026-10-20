import { apiClient } from "@/api/client";
import type { ApiResponse } from "@/types/common";
import type { AdminProductResponse, CreateAdminProductPayload } from "@/types/admin-products";
import type { Product, ProductListData, ProductListParams } from "@/types/products";

export const getAdminProducts = async (params?: ProductListParams): Promise<ApiResponse<ProductListData>> => {
  const response = await apiClient.get<ApiResponse<ProductListData>>("/api/admin/products", { params });
  return response.data;
};

export const getAdminProductById = async (id: string): Promise<ApiResponse<{ product: Product }>> => {
  const response = await apiClient.get<ApiResponse<{ product: Product }>>(`/api/admin/products/${id}`);
  return response.data;
};

export const createAdminProduct = async (payload: CreateAdminProductPayload): Promise<ApiResponse<AdminProductResponse>> => {
  const response = await apiClient.post<ApiResponse<AdminProductResponse>>("/api/products", payload);
  return response.data;
};
