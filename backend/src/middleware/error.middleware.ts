import type {
    Request,
    Response,
    NextFunction,
    ErrorRequestHandler,
} from "express";
import { z } from "zod";

import { AppError } from "../utils/app-error.js";
import { NODE_ENV } from "../config/env.js";

export const errorHandler: ErrorRequestHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    // 1. 已知业务错误：带明确状态码与消息
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.code && { code: err.code }),
        });
        return;
    }

    // 2. 未捕获的 Zod 校验错误
    if (err instanceof z.ZodError) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: z.treeifyError(err),
        });
        return;
    }

    // 3. PostgreSQL 唯一约束 / 外键约束冲突
    const pgError = err as { code?: string; detail?: string };

    if (pgError.code === "23505") {
        res.status(409).json({
            success: false,
            message: "A record with this unique identifier already exists",
        });
        return;
    }

    if (pgError.code === "23503") {
        res.status(400).json({
            success: false,
            message: "Referenced entity does not exist",
        });
        return;
    }

    // 4. 未预期的程序错误
    console.error("Unhandled Application Error:", err);

    res.status(500).json({
        success: false,
        message: "An unexpected error occurred on the server",
        ...(NODE_ENV === "development" && {
            stack: err.stack,
            errorDetails: err.message,
        }),
    });
};
