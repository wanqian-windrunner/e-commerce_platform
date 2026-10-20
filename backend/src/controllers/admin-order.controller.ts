import type { Request, Response, NextFunction } from "express"
import {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
} from "../services/admin-order.service.js"
import {
    orderIdParamSchema,
    orderListQuerySchema,
    updateOrderStatusSchema,
} from "../validations/order.validation.js"

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        const result = await getAllOrders(validationResult.data)

        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        const order = await getOrderById(validationResult.data.id)

        res.status(200).json({
            success: true,
            data: order
        })
    } catch (error) {
        next(error)
    }
}

export const updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const paramResult = orderIdParamSchema.safeParse(req.params)

    if (!paramResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid order ID",
            errors: paramResult.error.issues
        })
        return
    }

    const bodyResult = updateOrderStatusSchema.safeParse(req.body)

    if (!bodyResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid status data",
            errors: bodyResult.error.issues
        })
        return
    }

    try {
        const updatedOrder = await updateOrderStatus(paramResult.data.id, bodyResult.data)

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: updatedOrder
        })
    } catch (error) {
        next(error)
    }
}
