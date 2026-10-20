import type { Pagination } from "@/types/common";
import type { OrderSummary } from "@/types/orders";

// admin-order.service.ts 的 getAllOrders 列表项
export interface AdminOrderSummary extends OrderSummary {
  userId: string;
}

// order.validation.ts 的 orderListQuerySchema
export interface AdminOrderListParams {
  page?: number;
  limit?: number;
  status?: OrderSummary["status"];
  paymentStatus?: OrderSummary["paymentStatus"];
}

// admin-order.service.ts 的 getAllOrders 返回值；controller 将其整体放入响应的 data
export interface AdminOrderListResult {
  data: AdminOrderSummary[];
  pagination: Pagination;
}
