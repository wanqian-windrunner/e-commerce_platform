import { getAdminUserById, getAdminUsers, updateAdminUser } from "@/api/admin-users.api";
import { queryKeys } from "@/lib/queryKeys";
import { useAuthStore } from "@/stores/authStore";
import type { AdminUserListParams, UpdateAdminUserPayload } from "@/types/admin-users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUpdateAdminUser = (userId: string) => {
  const queryClient = useQueryClient();
  const admin = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (payload: UpdateAdminUserPayload) => updateAdminUser(userId, payload),
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers.detail(admin?.id ?? "", userId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers.lists(admin?.id ?? "") }),
      ]);
    },
  });
};

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
