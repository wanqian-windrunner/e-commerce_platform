import { apiClient } from "@/api/client";
import type { AddCartItemPayload, AddedCartItem, Cart} from "@/types/cart";
import type { ApiResponse } from "@/types/common";

export const getCart = async (): Promise<ApiResponse<Cart>> => {
  const response = await apiClient.get<ApiResponse<Cart>>(`/api/cart`);
  return response.data;
};

export const addCartItem = async (
  payload: AddCartItemPayload,
): Promise<ApiResponse<AddedCartItem>> => {
  const response = await apiClient.post<ApiResponse<AddedCartItem>>("/api/cart/items", payload);
  return response.data;
};

export const updateCartItem = async (productId:string, quantity:number):Promise<ApiResponse<AddedCartItem>> => {
  const response = await apiClient.patch<ApiResponse<AddedCartItem>>(`/api/cart/items/${productId}`, {quantity})
  return response.data
}

export const deleteCartItem = async (productId:string):Promise<void> => {
  await apiClient.delete(`/api/cart/items/${productId}`)
}

export const clearCart = async (): Promise<void> => {
  await apiClient.delete("/api/cart");
};