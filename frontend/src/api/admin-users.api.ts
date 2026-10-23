import { apiClient } from "@/api/client";
import type { AdminUser, AdminUserListParams, AdminUserListResponse, UpdateAdminUserPayload } from "@/types/admin-users";
import type { ApiResponse } from "@/types/common";

export const getAdminUsers = async (params: AdminUserListParams): Promise<AdminUserListResponse> => {
  const response = await apiClient.get<AdminUserListResponse>("/api/admin/users", { params });
  return response.data;
};

export const getAdminUserById = async (id: string): Promise<ApiResponse<AdminUser>> => {
  const response = await apiClient.get<ApiResponse<AdminUser>>(`/api/admin/users/${id}`);
  return response.data;
};

export const updateAdminUser = async (id: string, payload: UpdateAdminUserPayload): Promise<ApiResponse<AdminUser>> => {
  const response = await apiClient.patch<ApiResponse<AdminUser>>(`/api/admin/users/${id}`, payload);
  return response.data;
};
