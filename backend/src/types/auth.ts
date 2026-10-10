import type { users } from "../database/schema/users.js";
import { orders } from "../database/schema/orders.js";

// Reuse role type directly from Drizzle schema definition
export type UserRole = typeof users.$inferSelect.role;
export type OrderStatus = (typeof orders.status.enumValues)[number];
export type PaymentStatus = (typeof orders.paymentStatus.enumValues)[number];

export const ALLOWED_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const ALLOWED_PAYMENT_TRANSITIONS: Record<
  PaymentStatus,
  PaymentStatus[]
> = {
  pending: ["paid", "failed"],
  paid: ["refunded"],
  failed: ["pending"],
  refunded: [],
};

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
}

export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface RegisterResult {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  accessToken: string;
}

export interface LoginResult {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  accessToken: string;
  refreshToken: string;
}

export interface GetAllOrdersOptions {
  page: number;
  limit: number;
  status?: OrderStatus | undefined;
  paymentStatus?: PaymentStatus | undefined;
}
