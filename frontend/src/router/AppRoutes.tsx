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
        {path: "admin/orders", element: <AdminOrdersPage /> }
      ]}
    ],
  },
];

export const router = createBrowserRouter(routes);
