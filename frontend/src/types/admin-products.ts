import type { Product } from "@/types/products";

// backend/src/validations/product.validation.ts: create requires a category and defaults stock/isActive.
export interface CreateAdminProductPayload {
  name: string;
  sku: string;
  categoryId: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
}

export type UpdateAdminProductPayload = Partial<CreateAdminProductPayload> & { categoryId?: string | null };
export type AdminProductResponse = { product: Product };
export type DeactivatedProductResponse = { product: Pick<Product, "id"> };
