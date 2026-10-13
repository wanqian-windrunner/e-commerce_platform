import type { ApiResponse} from '@/types/common';
import type {ProductListParams, Product, ProductListData} from '@/types/products'
import { apiClient } from '@/api/client';



export const getProducts = async ( params?: ProductListParams ): Promise<ApiResponse<ProductListData>> => {
    const response = await apiClient    
        .get<ApiResponse<ProductListData>>(
            "/api/products",
            { params }
        )
    return response.data
}

export const getProductBySlug = async (slug: string): Promise<ApiResponse<{ product: Product }>> => {
    const response = await apiClient
        .get<ApiResponse<{ product: Product }>>(`/api/products/slug/${slug}`)
    return response.data
}

export const getProductById = async (id: string): Promise<ApiResponse<{ product: Product }>> => {
    const response = await apiClient
        .get<ApiResponse<{ product: Product }>>(`/api/products/${id}`)
    return response.data
}