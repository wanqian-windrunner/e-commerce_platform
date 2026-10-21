import { getAdminUserById, getAdminUsers } from "@/api/admin-users.api";
import { queryKeys } from "@/lib/queryKeys";
import { useAuthStore } from "@/stores/authStore";
import type { AdminUserListParams } from "@/types/admin-users";
import { useQuery } from "@tanstack/react-query";

export const useAdminUserById = (userId: string) => {
  const admin = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  return useQuery({
    queryKey: queryKeys.adminUsers.detail(admin?.id ?? "", userId),
    queryFn: () => getAdminUserById(userId),
    select: (response) => response.data,
    enabled: !isLoading && admin?.role === "admin" && Boolean(userId),
  });
};

export const useAdminUsers = (params: AdminUserListParams) => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  return useQuery({
    queryKey: queryKeys.adminUsers.list(user?.id ?? "", params),
    queryFn: () => getAdminUsers(params),
    enabled: !isLoading && user?.role === "admin",
  });
};
