import type { UserRole } from "@/types/auth";
import type { ApiResponse } from "@/types/common";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAdminUserPayload {
  role?: UserRole;
  isActive?: boolean;
}

export interface AdminUserListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AdminUserListResponse extends ApiResponse<AdminUser[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
