import type { ProductListParams } from "@/types/products";
import type { OrderListParams } from "@/types/orders";
import type { AdminOrderListParams } from "@/types/admin-orders";
import type { AdminUserListParams } from "@/types/admin-users";

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
  categories: {
    all: ["categories"] as const,
  },
  adminCategories: {
    list: (adminId: string) => ["adminCategories", adminId, "list"] as const,
    detail: (adminId: string, categoryId: string) =>
      ["adminCategories", adminId, "detail", categoryId] as const,
  },
  adminProducts: {
    lists: (adminId: string) => ["adminProducts", adminId, "list"] as const,
    list: (adminId: string, params?: ProductListParams) =>
      ["adminProducts", adminId, "list", params ?? {}] as const,
    detail: (adminId: string, productId: string) =>
      ["adminProducts", adminId, "detail", productId] as const,
  },
  adminUsers: {
    lists: (adminId: string) => ["adminUsers", adminId, "list"] as const,
    list: (adminId: string, params: AdminUserListParams) =>
      ["adminUsers", adminId, "list", params] as const,
  },
  adminOrder: {
    lists: (adminId: string) => ["adminOrder", adminId, "list"] as const,
    all: (adminId: string, params?: AdminOrderListParams) =>
      ["adminOrder", adminId, "list", params ?? {}] as const,
    byId: (adminId: string, orderId: string) =>
      ["adminOrder", adminId, "detail", orderId] as const,
  },
};
