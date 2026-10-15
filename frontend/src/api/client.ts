import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiErrorResponse, ApiResponse } from "@/types/common";
import { useAuthStore } from "@/stores/authStore";
import type { RefreshResult } from "@/types/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL is not defined in the environment variables.",
  );
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const parseApiError = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const payload = error.response?.data;
    if (Array.isArray(payload?.errors) && payload.errors.length) {
      return payload.errors.map((err) => err.message).join("; ");
    }
    if (payload?.message) {
      return payload.message;
    }
    if (!error.response) {
      return "Network error.";
    }
  }
  return "An unexpected error occurred.";
};

// 请求拦截器，用来带上accesstoken
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 重新实现刷新token请求
let refreshPromise: Promise<string | null> | null = null;

export const refreshAccessToken = (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise; // 防止并发请求重复刷新
  refreshPromise = (async () => {
    try {
      const res = await axios.post<ApiResponse<RefreshResult>>(
        `${BASE_URL}/api/auth/refresh`,
        undefined,
        { withCredentials: true },
      );
      const token = res.data.data.accessToken;
      useAuthStore.setState({ accessToken: token });
      return token;
    } catch {
      // 报错就拉闸
      useAuthStore.setState({ user: null, accessToken: null });
      return null;
    } finally {
      refreshPromise = null; // 刷新完成
    }
  })();
  return refreshPromise;
};

// 响应拦截器
apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiErrorResponse>) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    if (!original) return Promise.reject(error); // 把错误往后继续抛

    const url = original.url ?? "";
    const isAuthRequest = url.includes("/auth/");

    // 非auth的401，且没重试过的请求进行刷新，其他的直接往后抛
    if (error.response?.status !== 401 || isAuthRequest || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    // 刷新token
    const token = await refreshAccessToken();

    if (!token) return Promise.reject(error);

    original.headers.Authorization = `Bearer ${token}`;
    return apiClient(original);
  },
);
