import { Router } from "express"
import { getAdminById, listAdmin } from "../controllers/product.controller.js"
import { authenticate, authorize } from "../middleware/auth.middleware.js"

const adminProductRouter = Router()

adminProductRouter.use(authenticate, authorize("admin"))
adminProductRouter.get("/", listAdmin)
adminProductRouter.get("/:id", getAdminById)

export default adminProductRouter
