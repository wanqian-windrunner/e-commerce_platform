import { Router } from "express"
import { login, logout, refresh, register } from "../controllers/auth.controller.js"
import { strictAuthRateLimiter } from "../middleware/rate-limit.middleware.js"

const authRouter = Router()

authRouter.post("/register", strictAuthRateLimiter, register)
authRouter.post("/login", strictAuthRateLimiter, login)
authRouter.post("/refresh", strictAuthRateLimiter, refresh)
authRouter.post("/logout", strictAuthRateLimiter, logout)

export default authRouter
