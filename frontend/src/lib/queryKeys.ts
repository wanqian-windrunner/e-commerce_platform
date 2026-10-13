import type { ProductListParams } from "@/types/products";

export const queryKeys = {
  products: {
    all: ["products"] as const, 
    list: (params?: ProductListParams) =>
      ["products", "list", params ?? {}] as const,
    detail: (slug: string) => ["products", "detail", slug] as const,
  },
};