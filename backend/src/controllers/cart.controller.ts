import type { Request, Response, NextFunction } from "express"
import {addCartItem,clearCart,getCart,removeCartItem,updateCartItem } from "../services/cart.service.js"
import {addCartItemSchema,cartItemProductIdParamSchema,updateCartItemSchema } from "../validations/cart.validation.js"
import { AppError } from "../utils/app-error.js"

const getAuthUserId = (req: Request): string => {
    if (!req.user?.id) {
        throw AppError.unauthorized("Authentication required")
    }
    return req.user.id
}

export const getItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = getAuthUserId(req)

        const cart = await getCart(userId)

        res.status(200).json({
            success: true,
            data: cart
        })
    } catch (error) {
        next(error)
    }
}

export const addItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = addCartItemSchema.safeParse(req.body)

    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid cart item data",
            errors: validationResult.error.issues
        })
        return
    }

    try {
        const userId = getAuthUserId(req)

        const item = await addCartItem(userId, validationResult.data)

        res.status(201).json({
            success: true,
            message: "Item added to cart successfully",
            data: item
        })
    } catch (error) {
        next(error)
    }
}

export const updateItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const paramResult = cartItemProductIdParamSchema.safeParse(req.params)

    if (!paramResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid product ID",
            errors: paramResult.error.issues
        })
        return
    }

    const bodyResult = updateCartItemSchema.safeParse(req.body)

    if (!bodyResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid quantity",
            errors: bodyResult.error.issues
        })
        return
    }

    try {
        const userId = getAuthUserId(req)

        const item = await updateCartItem(userId, paramResult.data.productId, bodyResult.data)

        res.status(200).json({
            success: true,
            message: "Cart item updated successfully",
            data: item
        })
    } catch (error) {
        next(error)
    }
}

export const removeItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = cartItemProductIdParamSchema.safeParse(req.params)

    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid product ID",
            errors: validationResult.error.issues
        })
        return
    }

    try {
        const userId = getAuthUserId(req)

        await removeCartItem(userId, validationResult.data.productId)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

export const clear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = getAuthUserId(req)

        await clearCart(userId)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
}
