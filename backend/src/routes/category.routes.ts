import { Router } from "express"
import {
    handleCreateCategory,
    handleDeactivateCategory,
    handleGetAllCategories,
    handleGetCategoryById,
    handleGetCategoryBySlug,
    handleUpdateCategory,
} from "../controllers/category.controller.js"
import { authenticate, authorize } from "../middleware/auth.middleware.js"

const categoryRouter = Router()

categoryRouter.get("/", handleGetAllCategories)
categoryRouter.get("/slug/:slug", handleGetCategoryBySlug)
categoryRouter.get("/:id", handleGetCategoryById)

categoryRouter.post("/", authenticate, authorize("admin"), handleCreateCategory)
categoryRouter.patch("/:id", authenticate, authorize("admin"), handleUpdateCategory)
categoryRouter.delete("/:id", authenticate, authorize("admin"), handleDeactivateCategory)

export default categoryRouter
