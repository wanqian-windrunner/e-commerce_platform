import { apiClient } from "@/api/client";
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
