import type { Request, Response, NextFunction } from "express"
import { createOrder, getUserOrderById, getUserOrders } from "../services/order.service.js"
import { AppError } from "../utils/app-error.js"
import {
    createOrderSchema,
    orderIdParamSchema,
    orderListQuerySchema,
} from "../validations/order.validation.js"

const getAuthUserId = (req: Request): string => {
    if (!req.user?.id) {
        throw AppError.unauthorized("Authentication required")
    }
    return req.user.id
}

export const createNewOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = createOrderSchema.safeParse(req.body)

    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid order data",
            errors: validationResult.error.issues
        })
        return
    }

    try {
        const userId = getAuthUserId(req)

        const order = await createOrder(userId, validationResult.data)

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order
        })
    } catch (error) {
        next(error)
    }
}

export const listAllUserOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = orderListQuerySchema.safeParse(req.query)

    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid query parameters",
            errors: validationResult.error.issues
        })
        return
    }

    try {
        const userId = getAuthUserId(req)
        const { page, limit } = validationResult.data

        const orders = await getUserOrders(userId, page, limit)

        res.status(200).json({
            success: true,
            data: orders
        })
    } catch (error) {
        next(error)
    }
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = orderIdParamSchema.safeParse(req.params)

    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid order ID",
            errors: validationResult.error.issues
        })
        return
    }

    try {
        const userId = getAuthUserId(req)

        const order = await getUserOrderById(userId, validationResult.data.id)

        res.status(200).json({
            success: true,
            data: order
        })
    } catch (error) {
        next(error)
    }
}
