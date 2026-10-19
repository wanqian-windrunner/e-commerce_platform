import type { ProductListParams } from "@/types/products";
import type { OrderListParams } from "@/types/orders";

export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (params?: ProductListParams) =>
      ["products", "list", params ?? {}] as const,
    detail: (slug: string) => ["products", "detail", slug] as const,
  },
  cart: {
    byUser: (userId: string) => ["cart", userId] as const,
  },
  order: {
    byUser: (userId: string, orderId: string) =>
      ["order", userId, "detail", orderId] as const,
    lists: (userId: string) => ["order", userId, "list"] as const,
    list: (userId: string, params?: OrderListParams) =>
      ["order", userId, "list", params ?? {}] as const,
  },
};
