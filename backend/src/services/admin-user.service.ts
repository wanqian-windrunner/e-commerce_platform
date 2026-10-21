import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { users } from "../database/schema/users.js";
import { db } from "../database/db.js";
import { AppError } from "../utils/app-error.js";

// 防止sql注入
export const escapeLikeString = (str: string) => {
  if (!str) return ""
  return str.replace(/[\\%_]/g, "\\$&")
}

export const getAdminUsers = async (page: number,limit: number,search?: string) => {
    const offset = (page - 1) * limit

    const [userList, totalResult] = await Promise.all([
        db  .select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                isActive: users.isActive,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt
            })
            .from(users)
            .where(search ? 
                or(
                    ilike(users.name, `%${escapeLikeString(search)}%`),
                    ilike(users.email, `%${escapeLikeString(search)}%`)
                )
                : undefined)
            .orderBy(desc(users.createdAt))
            .limit(limit)
            .offset(offset)
        ,
        db  .select({ total: count() })
            .from(users)
            .where(search ? 
                or(
                    ilike(users.name, `%${escapeLikeString(search)}%`),
                    ilike(users.email, `%${escapeLikeString(search)}%`)
                )
                : undefined)
    ])

    const total = totalResult[0]?.total ?? 0

    return {
        users: userList,
        pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        }
    }
}

export const getAdminUserById = async (userId: string) => {
    const [user] = await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            isActive: users.isActive,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)

    if (!user) {
        throw AppError.notFound("User not found")
    }

    return user
}

export const updateAdminUser = async (
  userId: string,
  input: {
    role?: "customer" | "admin"
    isActive?: boolean
  },
  currentAdminId?: string
) => {
  return db.transaction(async (tx) => {
    // Serialize admin updates so concurrent demotions cannot remove every active admin.
    await tx.execute(sql`SELECT pg_advisory_xact_lock(82473928)`)

    if (!currentAdminId) {
      throw AppError.unauthorized()
    }

    const [currentAdmin] = await tx
      .select({ role: users.role, isActive: users.isActive })
      .from(users)
      .where(eq(users.id, currentAdminId))
      .limit(1)

    if (currentAdmin?.role !== "admin" || !currentAdmin.isActive) {
      throw AppError.forbidden("Admin access is no longer available")
    }

    const [existingUser] = await tx
      .select({ id: users.id, role: users.role, isActive: users.isActive })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!existingUser) {
      throw AppError.notFound("User not found")
    }

    if (userId === currentAdminId) {
      if (input.isActive === false && existingUser.isActive) {
        throw AppError.badRequest("You cannot deactivate your own admin account")
      }
      if (input.role === "customer" && existingUser.role === "admin") {
        throw AppError.badRequest("You cannot remove your own admin role")
      }
    }

    if (existingUser.role === "admin" && existingUser.isActive &&
        (input.role === "customer" || input.isActive === false)) {
      const [{ total }] = await tx
        .select({ total: count() })
        .from(users)
        .where(and(eq(users.role, "admin"), eq(users.isActive, true)))

      if (total <= 1) {
        throw AppError.badRequest("At least one active admin must remain")
      }
    }

    const [updatedUser] = await tx
      .update(users)
      .set({
        ...input,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })

    if (!updatedUser) {
      throw AppError.internal("Failed to update user")
    }

    return updatedUser
  })
};