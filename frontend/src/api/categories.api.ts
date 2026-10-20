import { apiClient } from "@/api/client";
import type { Category } from "@/types/categories";
import type { ApiResponse } from "@/types/common";

export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  const response = await apiClient
    .get<ApiResponse<Category[]>>("/api/categories");
  return response.data;
};
