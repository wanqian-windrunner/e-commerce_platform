import { apiClient } from "@/api/client";
import type {
  AuthResult,
  CurrentUser,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";
import type { ApiResponse } from "@/types/common";

export const register = async (
  payload: RegisterPayload,
): Promise<ApiResponse<AuthResult>> => {
  const { data } = await apiClient.post<ApiResponse<AuthResult>>(
    "/api/auth/register",
    payload,
  );
  return data;
};

export const login = async (
  payload: LoginPayload,
): Promise<ApiResponse<AuthResult>> => {
  const { data } = await apiClient.post<ApiResponse<AuthResult>>(
    "/api/auth/login",
    payload,
  );
  return data;
};

// 刷新逻辑在api/client.ts重新实现了一下
// export const refresh = async (): Promise<ApiResponse<RefreshResult>> => {
//     const {data} = await apiClient
//     .post<ApiResponse<RefreshResult>>(
//         "/api/auth/refresh"
//     )
//     return data
// }

export const logout = async (): Promise<void> => {
  await apiClient.post("/api/auth/logout");
};

export const getCurrentUser = async (): Promise<
  ApiResponse<{ user: CurrentUser }>
> => {
  const { data } =
    await apiClient.get<ApiResponse<{ user: CurrentUser }>>("/api/users/me");
  return data;
};
    