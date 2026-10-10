import { count, desc, eq, ilike, or } from "drizzle-orm";
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
  const existingUser = await getAdminUserById(userId)

  if (currentAdminId && userId === currentAdminId && input.isActive === false && existingUser.isActive === true ) {
    throw AppError.badRequest("You cannot deactivate your own admin account")
  }

  const [updatedUser] = await db
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
};