import { apiClient } from "@/api/client";
import type { CreateAdminCategoryPayload, UpdateAdminCategoryPayload } from "@/types/admin-categories";
import type { Category } from "@/types/categories";
import type { ApiResponse } from "@/types/common";

export const getAdminCategories = async (): Promise<ApiResponse<Category[]>> => {
  const response = await apiClient.get<ApiResponse<Category[]>>("/api/admin/categories");
  return response.data;
};

export const getAdminCategoryById = async (id: string): Promise<ApiResponse<Category>> => {
  const response = await apiClient.get<ApiResponse<Category>>(`/api/admin/categories/${id}`);
  return response.data;
};

export const createAdminCategory = async (payload: CreateAdminCategoryPayload): Promise<ApiResponse<Category>> => {
  const response = await apiClient.post<ApiResponse<Category>>("/api/categories", payload);
  return response.data;
};

export const updateAdminCategory = async (id: string, payload: UpdateAdminCategoryPayload): Promise<ApiResponse<Category>> => {
  const response = await apiClient.patch<ApiResponse<Category>>(`/api/categories/${id}`, payload);
  return response.data;
};
