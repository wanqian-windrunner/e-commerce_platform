import type { ProductListParams } from "@/types/products";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getProducts, getProductBySlug } from "@/api/products.api";

export const useProducts = (params?: ProductListParams) =>
  useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => getProducts(params),
    select: (res) => res.data,
  });

export const useProductBySlug = (slug: string) =>
  useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => getProductBySlug(slug),
    select: (res) => res.data.product,
    enabled: Boolean(slug),
  });
