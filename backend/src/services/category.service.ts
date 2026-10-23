import { and, asc, eq, ne, or } from "drizzle-orm";
import { categories } from "../database/schema/categories.js";
import { db } from "../database/db.js";
import { AppError } from "../utils/app-error.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../validations/category.validation.js";


export const getAllCategories = async (includeInactive = false) => {
    const whereCondition = includeInactive ? undefined : eq(categories.isActive, true)
    const allCategories = await db
        .select()
        .from(categories)
        .where(whereCondition)
        .orderBy(asc(categories.name))
    return allCategories
}

export const getCategoryById = async (categoryId: string) => {
    const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, categoryId))
        .limit(1)

    if (!category) {
        throw AppError.notFound("Category not found")
    }

    return category
}

export const getActiveCategoryById = async (categoryId: string) => {
    const [category] = await db
        .select()
        .from(categories)
        .where(and(eq(categories.id, categoryId), eq(categories.isActive, true)))
        .limit(1)

    if (!category) {
        throw AppError.notFound("Category not found")
    }

    return category
}

export const getCategoryBySlug = async (slug: string) => {
    const [category] = await db
        .select()
        .from(categories)
        .where(and(eq(categories.slug, slug), eq(categories.isActive, true)))
        .limit(1)

    if (!category) {
        throw AppError.notFound("Category not found")
    }

    return category
}

export const createCategory = async (input: CreateCategoryInput) => {
    const [existing] = await db
        .select({name: categories.name, slug: categories.slug})
        .from(categories)
        .where(or(eq(categories.name, input.name), eq(categories.slug, input.slug)))
        .limit(1)

    if (existing) {
        if (existing.name === input.name) {
            throw AppError.conflict("A category with this name already exists")
        }
        if (existing.slug === input.slug) {
            throw AppError.conflict("A category with this slug already exists")
        }
    }

    if (input.parentId) {
        await getCategoryById(input.parentId);
    }

    try {
        const [category] = await db
            .insert(categories)
            .values({
                name: input.name,
                slug: input.slug,
                description: input.description,
                parentId: input.parentId ?? null
            })
            .returning()

        if (!category) {
            throw AppError.internal("Failed to create category")
        }

        return category
    } catch (error: any) {
        if (error?.code === "23505") {
            throw AppError.conflict(
                "A category with this name or slug already exists"
            )
        }
        throw error
    }
}

export const updateCategory = async (categoryId: string,input: UpdateCategoryInput,) => {
    const existingCategory = await getCategoryById(categoryId)

    if (input.parentId && input.parentId === categoryId) {
        throw AppError.badRequest("A category cannot be its own parent")
    }

    if (input.parentId && input.parentId !== existingCategory.parentId) {
        const visited = new Set<string>()
        let parentId: string | null = input.parentId

        while (parentId) {
            if (parentId === categoryId || visited.has(parentId)) {
                throw AppError.badRequest("A category cannot be a descendant of itself")
            }
            visited.add(parentId)
            const parent = await getCategoryById(parentId)
            parentId = parent.parentId
        }
    }

    if (input.name || input.slug) {
        const conditions = [];
        if (input.name) conditions.push(eq(categories.name, input.name))
        if (input.slug) conditions.push(eq(categories.slug, input.slug))
        
        const [duplicate] = await db
            .select({name: categories.name, slug: categories.slug})
            .from(categories)
            .where(and(ne(categories.id, categoryId), or(...conditions)))
            .limit(1)
        
        if (duplicate) {
            if (input.name && (duplicate.name === input.name)) {
                throw AppError.conflict("A category with this name already exists")
            }
            if (input.slug && (duplicate.slug === input.slug)) {
                throw AppError.conflict("A category with this slug already exists")
            }
        }
    }
    const [updateCategory] = await db
        .update(categories)
        .set({
            ...(input.name !== undefined && {name: input.name}),
            ...(input.slug !== undefined && {slug: input.slug}),
            ...(input.description !== undefined && {
                description: input.description
            }),
            ...(input.parentId !== undefined && {parentId: input.parentId}),
            ...(input.isActive !== undefined && {isActive: input.isActive}),
            updatedAt: new Date()
        })
        .where(eq(categories.id, categoryId))
        .returning()

    if (!updateCategory) {
        throw AppError.internal("Failed to update category")
    }

    return updateCategory
}

export const deleteCategory = async (categoryId: string) => {
    const exisitingCategory = await getCategoryById(categoryId)

    if (!exisitingCategory.isActive) {
        throw AppError.badRequest("Category is already inactive")
    }

    const [updatedCategory] = await db
        .update(categories)
        .set({
            isActive: false,
            updatedAt: new Date()
        })
        .where(eq(categories.id, categoryId))
        .returning()

    if (!updatedCategory) {
        throw AppError.internal("Failed to deactivate category")
    }

    return updatedCategory
}