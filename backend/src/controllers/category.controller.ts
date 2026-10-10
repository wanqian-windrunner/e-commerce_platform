import type { Request, Response, NextFunction } from "express"
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    getCategoryById,
    getCategoryBySlug,
    updateCategory,
} from "../services/category.service.js"
import {
    categoryIdParamSchema,
    categoryListQuerySchema,
    categorySlugParamSchema,
    createCategorySchema,
    updateCategorySchema,
} from "../validations/category.validation.js"

export const handleGetAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = categoryListQuerySchema.safeParse(req.query)

    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid query parameters",
            errors: validationResult.error.issues
        })
        return
    }

    try {
        const categories = await getAllCategories(validationResult.data.includeInactive)

        res.status(200).json({
            success: true,
            data: categories
        })
    } catch (error) {
        next(error)
    }
}

export const handleGetCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = categoryIdParamSchema.safeParse(req.params)

    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid category ID",
            errors: validationResult.error.issues
        })
        return
    }

    try {
        const category = await getCategoryById(validationResult.data.id)

        res.status(200).json({
            success: true,
            data: category
        })
    } catch (error) {
        next(error)
    }
}

export const handleGetCategoryBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = categorySlugParamSchema.safeParse(req.params)

    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid category slug",
            errors: validationResult.error.issues
        })
        return
    }

    try {
        const category = await getCategoryBySlug(validationResult.data.slug)

        res.status(200).json({
            success: true,
            data: category
        })
    } catch (error) {
        next(error)
    }
}

export const handleCreateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = createCategorySchema.safeParse(req.body)

    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid category data",
            errors: validationResult.error.issues
        })
        return
    }

    try {
        const category = await createCategory(validationResult.data)

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        })
    } catch (error) {
        next(error)
    }
}

export const handleUpdateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const paramResult = categoryIdParamSchema.safeParse(req.params)

    if (!paramResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid category ID",
            errors: paramResult.error.issues
        })
        return
    }

    const bodyResult = updateCategorySchema.safeParse(req.body)

    if (!bodyResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid category data",
            errors: bodyResult.error.issues
        })
        return
    }

    try {
        const category = await updateCategory(paramResult.data.id, bodyResult.data)

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        })
    } catch (error) {
        next(error)
    }
}

export const handleDeactivateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = categoryIdParamSchema.safeParse(req.params)

    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid category ID",
            errors: validationResult.error.issues
        })
        return
    }

    try {
        const category = await deleteCategory(validationResult.data.id)

        res.status(200).json({
            success: true,
            message: "Category deactivated successfully",
            data: category
        })
    } catch (error) {
        next(error)
    }
}
