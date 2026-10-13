import { createBrowserRouter, Navigate, type RouteObject } from "react-router";
import { ProductsPage } from "@/pages/ProductsPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <div>Menu </div>,
    children:[
        {
            path: '/',
            element: <Navigate to="/products" replace />
        },
        {
            path: 'products',
            element: <ProductsPage />
        }
    ]
  },
];

export const router = createBrowserRouter(routes);
