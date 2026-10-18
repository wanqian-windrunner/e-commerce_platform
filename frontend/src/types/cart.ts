// cart.service.ts的getCart 返回值
export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  subtotal: string;
  createdAt: string;
  updatedAt: string;
}
// Cart下级
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: CartItemProduct;
}
// CartItem下级
export interface CartItemProduct {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
}
// cart.service.ts的addCartItem 参数
export interface AddCartItemPayload {
  productId: string;
  quantity: number;
}
// cart.service.ts的addCartItem 返回值
export interface AddedCartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}
