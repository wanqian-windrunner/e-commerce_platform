import rateLimit, { type Options } from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";

import { AppError } from "../utils/app-error.js";

// 多实例部署时可换 Redis store：
// import RedisStore from "rate-limit-redis";
// import { redisClient } from "../config/redis";

const rateLimitHandler = (
    _req: Request,
    _res: Response,
    next: NextFunction,
    _options: Options,
) => {
    next(
        new AppError(
            "Too many requests. Please try again in 15 minutes.",
            429,
            "TOO_MANY_REQUESTS"
        )
    )
}

// 严格限流：登录、注册等易被爆破的接口，15 分钟 10 次
export const strictAuthRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: rateLimitHandler
    // store: new RedisStore({ sendCommand: (...args: string[]) => redisClient.sendCommand(args) }),
})

// 中等限流：刷新 token、登出、/me 等会话维护接口，15 分钟 60 次
export const tokenRefreshRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 60,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: rateLimitHandler
    // store: new RedisStore({ sendCommand: (...args: string[]) => redisClient.sendCommand(args) }),
})
