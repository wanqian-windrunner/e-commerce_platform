import { RouterProvider } from "react-router";
import { router } from "./router/AppRoutes";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const bootstrap = useAuthStore((state) => state.bootstrap);
  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
