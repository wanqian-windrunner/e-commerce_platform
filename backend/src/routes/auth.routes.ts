import { Router } from "express"
import { login, logout, refresh, register } from "../controllers/auth.controller.js"
import { strictAuthRateLimiter, tokenRefreshRateLimiter } from "../middleware/rate-limit.middleware.js"

const authRouter = Router()

authRouter.post("/register", strictAuthRateLimiter, register);
authRouter.post("/login", strictAuthRateLimiter, login);
authRouter.post("/refresh", tokenRefreshRateLimiter, refresh);
authRouter.post("/logout", tokenRefreshRateLimiter, logout);

export default authRouter
