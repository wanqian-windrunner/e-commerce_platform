import {
  createBrowserRouter,
  Navigate,
  Outlet,
  type RouteObject,
} from "react-router";
import { ProductsPage } from "@/pages/ProductsPage";
import { StorefrontLayout } from "@/layouts/StorefrontLayout";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <StorefrontLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/products" replace />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
