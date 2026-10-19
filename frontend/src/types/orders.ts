import type { Pagination } from "@/types/common";

// order.service.ts 的 createOrder 输入
export interface CreateOrderPayload {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
}

// order.service.ts 的 createOrder 返回值
export interface CreatedOrder {
  id: string;
  orderNumber: string;
  userId: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  subtotal: string;
  taxAmount: string;
  shippingAmount: string;
  discountAmount: string;
  totalAmount: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  items: CreatedOrderItem[];
}

// order.service.ts 的 orderItemValues 和 createOrder 返回值的下级类型
export interface CreatedOrderItem {
  productId: string;
  productName: string;
  unitPrice: string;
  quantity: number;
  subtotal: string;
}

// order.service.ts 的 getUserOrderById 返回值, 从类型 CreatedOrder 中去掉 items
export interface OrderDetail extends Omit<CreatedOrder, "items"> {
  items: OrderDetailItem[];
}

// order.service.ts 的 getUserOrderById 返回值下级类型
export interface OrderDetailItem {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  productSku: string | null;
  unitPrice: string;
  quantity: number;
  subtotal: string;
  createdAt: string;
  updatedAt: string;
}

// order.service.ts 的 getUserOrders 查询字段
export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: CreatedOrder["status"];
  paymentStatus: CreatedOrder["paymentStatus"];
  subtotal: string;
  shippingAmount: string;
  totalAmount: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListParams {
  page?: number;
  limit?: number;
}

export interface OrderListResult {
  data: OrderSummary[];
  pagination: Pagination;
}