import { createBrowserRouter, Navigate, type RouteObject } from "react-router";
import { ProductsPage } from "@/pages/ProductsPage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { StorefrontLayout } from "@/layouts/StorefrontLayout";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ProtectedRoute } from "@/router/ProtectedRoute";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { OrderDetailPage } from "@/pages/OrderDetailPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { AdminRoute } from "@/router/AdminRoute";
import { AdminOrdersPage } from "@/pages/AdminOrdersPage";
import { AdminOrderDetailPage } from "@/pages/AdminOrderDetailPage";
import { AdminProductsPage } from "@/pages/AdminProductsPage";
import { AdminProductDetailPage } from "@/pages/AdminProductDetailPage";
import { AdminProductCreatePage } from "@/pages/AdminProductCreatePage";
import { AdminProductEditPage } from "@/pages/AdminProductEditPage";
import { AdminCategoriesPage } from "@/pages/AdminCategoriesPage";
import { AdminCategoryDetailPage } from "@/pages/AdminCategoryDetailPage";
import { AdminCategoryCreatePage } from "@/pages/AdminCategoryCreatePage";
import { AdminCategoryEditPage } from "@/pages/AdminCategoryEditPage";
import { AdminUsersPage } from "@/pages/AdminUsersPage";
import { AdminUserDetailPage } from "@/pages/AdminUserDetailPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <StorefrontLayout />,
    children: [
      { index: true, element: <Navigate to="/products" replace /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:slug", element: <ProductDetailPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { element: <ProtectedRoute />, children: [
        {path: "cart", element: <CartPage />},
        {path: "checkout", element: <CheckoutPage /> },
        {path: "orders/:id", element: <OrderDetailPage /> },
        {path: "orders", element: <OrdersPage />}
      ] },
      { element: <AdminRoute />, children:[
        {path: "admin/orders", element: <AdminOrdersPage /> },
        {path: "admin/orders/:id", element: <AdminOrderDetailPage /> },
        {path: "admin/products", element: <AdminProductsPage /> },
        {path: "admin/products/new", element: <AdminProductCreatePage /> },
        {path: "admin/products/:id", element: <AdminProductDetailPage /> },
        {path: "admin/products/:id/edit", element: <AdminProductEditPage /> },
        {path: "admin/categories", element: <AdminCategoriesPage /> },
        {path: "admin/categories/new", element: <AdminCategoryCreatePage /> },
        {path: "admin/categories/:id", element: <AdminCategoryDetailPage /> },
        {path: "admin/categories/:id/edit", element: <AdminCategoryEditPage /> },
        {path: "admin/users", element: <AdminUsersPage /> },
        {path: "admin/users/:id", element: <AdminUserDetailPage /> }
      ]}
    ],
  },
];

export const router = createBrowserRouter(routes);
