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

// admin-order.service.ts 的 getAllOrders 返回值
export interface AdminOrderListResult {
  data: AdminOrderSummary[];
  pagination: Pagination;
}

// admin-order.service.ts 的 getOrderById 返回值
export interface AdminOrderDetail extends AdminOrderSummary {
  items: AdminOrderDetailItem[];
}

// admin-order.service.ts 的 getOrderById 返回值中的 items
export interface AdminOrderDetailItem {
  id: string;
  productId: string | null;
  productName: string;
  unitPrice: string;
  quantity: number;
  subtotal: string;
  currentProductImage: string | null;
  createdAt: string;
  updatedAt: string;
}
// order.validation.ts 的 updateOrderStatusSchema
export interface UpdateAdminOrderStatusPayload {
  status: OrderSummary["status"];
}
// admin-order.service.ts 的 updateOrderStatus 返回值
export interface UpdatedAdminOrder extends AdminOrderSummary {
  taxAmount: string;
  discountAmount: string;
}