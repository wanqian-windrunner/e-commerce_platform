import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // ⚠️ mutation 成功后必须 invalidate
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
