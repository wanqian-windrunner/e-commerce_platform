import { apiClient } from "@/api/client";
import type { AdminUserListParams, AdminUserListResponse } from "@/types/admin-users";

export const getAdminUsers = async (params: AdminUserListParams): Promise<AdminUserListResponse> => {
  const response = await apiClient.get<AdminUserListResponse>("/api/admin/users", { params });
  return response.data;
};
