import { Router } from "express"
import {
    handleGetAdminUserById,
    handleGetAdminUsers,
    handleUpdateAdminUser,
} from "../controllers/admin-user.controller.js"
import { authenticate, authorize } from "../middleware/auth.middleware.js"

const adminUserRouter = Router()

adminUserRouter.use(authenticate)
adminUserRouter.use(authorize("admin"))

adminUserRouter.get("/", handleGetAdminUsers)
adminUserRouter.get("/:id", handleGetAdminUserById)
adminUserRouter.patch("/:id", handleUpdateAdminUser)

export default adminUserRouter
