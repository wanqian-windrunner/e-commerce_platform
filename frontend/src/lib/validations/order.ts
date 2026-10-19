import { z } from "zod";

// 对齐 backend/src/validations/order.validation.ts 的 createOrderSchema
export const checkoutSchema = z.object({
  shippingName: z
    .string()
    .trim()
    .min(2, "Shipping name must be at least 2 characters")
    .max(200, "Shipping name cannot exceed 200 characters"),
  shippingPhone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-()]{7,30}$/, "Shipping phone contains invalid characters")
    .refine(
      (value) => (value.match(/[0-9]/g) ?? []).length >= 7,
      "Shipping phone must contain at least 7 digits",
    ),
  shippingAddress: z
    .string()
    .trim()
    .min(5, "Shipping address must be at least 5 characters")
    .max(1000, "Shipping address cannot exceed 1000 characters"),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
