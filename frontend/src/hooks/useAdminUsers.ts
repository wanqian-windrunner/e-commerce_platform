import { getAdminUsers } from "@/api/admin-users.api";
import { queryKeys } from "@/lib/queryKeys";
import { useAuthStore } from "@/stores/authStore";
import type { AdminUserListParams } from "@/types/admin-users";
import { useQuery } from "@tanstack/react-query";

export const useAdminUsers = (params: AdminUserListParams) => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  return useQuery({
    queryKey: queryKeys.adminUsers.list(user?.id ?? "", params),
    queryFn: () => getAdminUsers(params),
    enabled: !isLoading && user?.role === "admin",
  });
};
