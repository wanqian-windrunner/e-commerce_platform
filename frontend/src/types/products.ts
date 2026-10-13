import type { Pagination } from "./common";

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: string;
  categoryId: string | null;
  description: string | null;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: ProductCategory| null;
}

export interface ProductCategory {
  id: string;
  name: string; 
  slug: string;
}

export interface ProductListData {
  products: Product[];
  pagination: Pagination;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
  includeInactive?: boolean;
}