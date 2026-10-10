import type { Request, Response, NextFunction } from "express"
import {
    adminUserIdParamSchema,
    adminUserListQuerySchema,
    adminUserUpdateSchema,
} from "../validations/admin-user.validation.js"
import {
    getAdminUsers,
    getAdminUserById,
    updateAdminUser,
} from "../services/admin-user.service.js"

export const handleGetAdminUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = adminUserListQuerySchema.safeParse(req.query)

    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid query parameters",
            errors: validationResult.error.issues
        })
        return
    }

    try {
        const { page, limit, search } = validationResult.data

        const result = await getAdminUsers(page, limit, search)

        res.status(200).json({
            success: true,
            data: result.users,
            pagination: result.pagination
        })
    } catch (error) {
        next(error)
    }
}

export const handleGetAdminUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = adminUserIdParamSchema.safeParse(req.params)

    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid user ID",
            errors: validationResult.error.issues
        })
        return
    }

    try {
        const user = await getAdminUserById(validationResult.data.id)

        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        next(error)
    }
}

export const handleUpdateAdminUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const paramResult = adminUserIdParamSchema.safeParse(req.params)

    if (!paramResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid user ID",
            errors: paramResult.error.issues
        })
        return
    }

    const bodyResult = adminUserUpdateSchema.safeParse(req.body)

    if (!bodyResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid user data",
            errors: bodyResult.error.issues
        })
        return
    }

    try {
        const sanitizedInput = Object.fromEntries(
            Object.entries(bodyResult.data).filter(([, value]) => value !== undefined)
        )

        const user = await updateAdminUser(
            paramResult.data.id,
            sanitizedInput,
            req.user?.id
        )

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        })
    } catch (error) {
        next(error)
    }
}
