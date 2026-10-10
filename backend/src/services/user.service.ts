import { eq } from "drizzle-orm";
import { db } from "../database/db.js";
import { users } from "../database/schema/users.js";
import { AppError } from "../utils/app-error.js";

export const getUserProfile = async (userId: string) => {
    const [user] = await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            isActive: users.isActive,
            createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

    if (!user) {
        throw AppError.notFound("User not found");
    }

    return user;
};

export const findUserAuthState = async (userId: string) => {
    const [user] = await db
        .select({
            id: users.id,
            role: users.role,
            isActive: users.isActive,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

    return user ?? null;// 这边不抛出错误，要在controller那边清cookie
};
