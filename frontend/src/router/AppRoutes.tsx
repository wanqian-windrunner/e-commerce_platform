import { createBrowserRouter, Navigate, type RouteObject } from "react-router";
import { ProductsPage } from "@/pages/ProductsPage";
import { StorefrontLayout } from "@/layouts/StorefrontLayout";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ProtectedRoute } from "@/router/ProtectedRoute";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <StorefrontLayout />,
    children: [
      { index: true, element: <Navigate to="/products" replace /> },
      { path: "products", element: <ProductsPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { element: <ProtectedRoute />, children: [] },
    ],
  },
];

export const router = createBrowserRouter(routes);
