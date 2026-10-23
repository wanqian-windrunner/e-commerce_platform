import { Router } from "express"
import { handleAdminGetAllCategories, handleAdminGetCategoryById } from "../controllers/category.controller.js"
import { authenticate, authorize } from "../middleware/auth.middleware.js"

const adminCategoryRouter = Router()

adminCategoryRouter.use(authenticate, authorize("admin"))
adminCategoryRouter.get("/", handleAdminGetAllCategories)
adminCategoryRouter.get("/:id", handleAdminGetCategoryById)

export default adminCategoryRouter
