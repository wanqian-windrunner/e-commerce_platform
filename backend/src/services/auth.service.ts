import { eq } from "drizzle-orm"
import { users } from "../database/schema/users.js"
import type { LoginResult, RegisterResult } from "../types/auth.js"
import type { LoginInput, RegisterInput } from "../validations/auth.validation.js"
import { db } from "../database/db.js"
import { hashPassword, verifyPassword } from "../utils/password.js"
import { AppError } from "../utils/app-error.js"
import { generateAccessToken } from "../utils/access-tokens.js"
import { createRefreshToken } from "./refresh-token.service.js"


export const registerUser = async ( input: RegisterInput ): Promise<RegisterResult> => {
    const normalizedEmail = input.email.trim().toLowerCase()

    const [existingUser] = await db
        .select({id: users.id})
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1)
    if (existingUser) {
        throw AppError.conflict("Email is already registered")
    }

    const passwordHash = await hashPassword(input.password)

    try {
        const [user] = await db
            .insert(users)
            .values({
                name: input.name.trim(),
                email: input.email.trim(),
                passwordHash
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role
            })
        if (!user) {
            throw AppError.badRequest("Failed to create user")
        }

        const accessToken = generateAccessToken({
            sub: user.id,
            role:user.role
        })

        return {user, accessToken}
    } catch (error:any) {
        if (error?.code === "23505") {
            throw AppError.conflict("Email is already registered")
        }
        throw error
    }
}

export const loginUser = async (input: LoginInput, userAgent: string|undefined, ipAddress: string|undefined ): Promise<LoginResult> => {
    const normalizedEmail = input.email.trim().toLowerCase()
    const [user] = await db
        .select({
            id: users.id,
            name:users.name,
            email: users.email,
            passwordHash: users.passwordHash,
            role: users.role,
            isActive: users.isActive
        })
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1)

    if (!user) {
        throw AppError.unauthorized("Invalid email or password")
    }
    if (!user.isActive) {
        throw AppError.forbidden("Account is inactive", "ACCOUNT_INACTIVE")
    }

    const passwordIsValid = await verifyPassword(input.password, user.passwordHash)
    if (!passwordIsValid) {
        throw AppError.unauthorized("Invalid email or password")
    }

    const accessToken = generateAccessToken({sub: user.id, role: user.role})
    const refreshToken = await createRefreshToken(user.id, userAgent, ipAddress)

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken
    }
}