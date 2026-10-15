import type { AuthUser, LoginPayload, RegisterPayload } from "@/types/auth";
import { create } from "zustand";
import * as authApi from "@/api/auth.api";
import { refreshAccessToken } from "@/api/client";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;

  // 定义的 action
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>; // 要防止strictmode导致组件初始化逻辑(useEffect)在挂载时强制连续运行两次
}

let bootstrapPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,

  login: async (payload) => {
    const { data } = await authApi.login(payload);
    set({ user: data.user, accessToken: data.accessToken });
  },
  register: async (payload) => {
    const { data } = await authApi.register(payload);
    set({ user: data.user, accessToken: data.accessToken });
  },
  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null, accessToken: null });
    }
  },
  bootstrap: async () => {
    if (bootstrapPromise) return bootstrapPromise;
    bootstrapPromise = (async () => {
      try {
        const accessToken = await refreshAccessToken()
        if (!accessToken) return;
        // set({ accessToken: accessToken }); 现在的新方法可以自动写入
        const me = await authApi.getCurrentUser();
        set({ user: me.data.user });
      } catch {
        set({ user: null, accessToken: null });
      } finally {
        set({ isLoading: false });
      }
    })();
    return bootstrapPromise;
  },
}));
