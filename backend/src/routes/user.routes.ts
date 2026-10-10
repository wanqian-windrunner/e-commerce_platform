import { Router } from "express"
import { getCurrentUser } from "../controllers/user.controller.js"
import { authenticate } from "../middleware/auth.middleware.js"

const userRouter = Router()

userRouter.get("/me", authenticate, getCurrentUser)

export default userRouter
