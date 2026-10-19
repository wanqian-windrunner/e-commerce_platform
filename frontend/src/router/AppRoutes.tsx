import { createBrowserRouter, Navigate, type RouteObject } from "react-router";
import { ProductsPage } from "@/pages/ProductsPage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { StorefrontLayout } from "@/layouts/StorefrontLayout";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ProtectedRoute } from "@/router/ProtectedRoute";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";

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
        { path: "checkout", element: <CheckoutPage /> },
      ] },
    ],
  },
];

export const router = createBrowserRouter(routes);
