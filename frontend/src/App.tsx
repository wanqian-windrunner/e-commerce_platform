import { RouterProvider } from "react-router"
import { router } from "./router/AppRoutes"

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
