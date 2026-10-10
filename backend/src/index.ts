import express from "express"
import type { Request, Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { httpRequestDuration, httpRequestsTotal, metricsRegistry } from "./config/metrics.js"
import { NODE_ENV, PORT } from "./config/env.js"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js"
import cartRouter from "./routes/cart.routes.js"
import orderRouter from "./routes/order.routes.js"
import adminOrderRouter from "./routes/admin-order.routes.js"
import categoryRouter from "./routes/category.routes.js"
import adminUserRouter from "./routes/admin-user.routes.js"
import { AppError } from "./utils/app-error.js"
import { errorHandler } from "./middleware/error.middleware.js"
import { connectDB, pool } from "./database/db.js"

export const app = express()

// 白名单
const allowedOrigins = [
    process.env.CLIENT_ORIGIN,
    process.env.CLIENT_URL,
    "http://localhost:5173"
].filter(Boolean) as string[]

app.use(cors({
    origin: (origin, callback) => {
        if (
            !origin ||
            allowedOrigins.includes(origin)
        ) {
            return callback(null, true)
        } else {
            return callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    const isMetricsEndpoint = req.path === "/metrics"

    if (isMetricsEndpoint) return next()

    const start = process.hrtime.bigint()

    res.on("finish", () => {
        const duration = Number(process.hrtime.bigint() - start) / 1_000_000_000;

        const route = req.route ? `${req.baseUrl}${req.route.path}` : "unknown";

        const statusCode = res.statusCode.toString();

        httpRequestsTotal.inc({
        method: req.method,
        route,
        status_code: statusCode,
        });

        httpRequestDuration.observe(
        {
            method: req.method,
            route,
            status_code: statusCode,
        },
        duration
        )
    })
    next()
})

app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/orders", orderRouter)
app.use("/api/admin/orders", adminOrderRouter)
app.use("/api/categories", categoryRouter)
app.use("/api/admin/users", adminUserRouter)

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "API is healthy",
        environment: NODE_ENV,
        timestamp: new Date().toISOString()
    })
})

app.get("/metrics", async (_req: Request, res: Response) => {
    res.set("Content-Type", metricsRegistry.contentType)
    res.end(await metricsRegistry.metrics())
})

app.use((_req, _res, next) => {
  next(AppError.notFound("Requested API route does not exist"));
})

app.use(errorHandler)

app.set("trust proxy", 1)

const startServer = async (): Promise<void> => {
    try {
        await connectDB()

        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`)
        })

        const shutdown = async (signal:string) => {
            console.log(`\n${signal} received. Closing HTTP server and DB connections...`)
            server.close(async () => {
                await pool.end()
                console.log("Server and database connections closed gracefully.")
                process.exit(0)
            })
        }

        process.on("SIGTERM",() => shutdown("SIGTERM"))
        process.on("SIGINT",() => shutdown("SIGINT"))
    } catch (error) {
        console.log("Failed to start server:", error)
        process.exit(1)
    }
}

void startServer()