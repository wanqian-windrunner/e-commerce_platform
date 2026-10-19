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