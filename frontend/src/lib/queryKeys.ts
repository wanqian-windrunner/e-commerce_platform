import type { ProductListParams } from "@/types/products";

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
    byUser: (userId: string, orderId: string) => [
      "order",
      userId,
      "detail",
      orderId,
    ],
  },
};
