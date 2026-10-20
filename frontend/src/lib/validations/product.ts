import { z } from "zod";
import type { CreateAdminProductPayload } from "@/types/admin-products";

// Mirrors backend/src/validations/product.validation.ts for the admin form.
const name = z.string().trim().min(2).max(200);
const sku = z.string().trim().min(1).max(100).regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/);
const money = z.string().trim().min(1, "Price is required").pipe(
  z.coerce.number<string>().finite().min(0).refine(
    (value) => Number.isInteger(value * 100),
    "Price can have at most 2 decimal places",
  ),
);
const stock = z.string().trim().min(1, "Stock is required").pipe(
  z.coerce.number<string>().int().min(0),
);
const imageUrl = z.union([z.url().max(2048), z.literal("")]);

export const productFormSchema = z.object({
  name,
  sku,
  categoryId: z.uuid("Choose a category"),
  description: z.string().trim().max(5000),
  price: money,
  stock,
  imageUrl,
  isActive: z.boolean(),
});

export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormValues = z.output<typeof productFormSchema>;

export const toProductPayload = (values: ProductFormValues): CreateAdminProductPayload => ({
  ...values,
  description: values.description || null,
  imageUrl: values.imageUrl || null,
});
