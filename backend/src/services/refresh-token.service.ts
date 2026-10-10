import { and, eq, gt } from "drizzle-orm"
import { REFRESH_TOKEN_EXPIRES_DAYS } from "../config/env.js"
import { db } from "../database/db.js"
import { refreshTokens } from "../database/schema/refresh_tokens.js"
import { generateRefreshToken, hashRefreshToken } from "../utils/refresh-token.js"


export const createRefreshToken = async (userId: string, userAgent: string|undefined, ipAddress: string|undefined): Promise<string> => {
    const rawToken = generateRefreshToken()
    const tokenHash = hashRefreshToken(rawToken)
    const expiresAt = new Date(
        Date.now() + REFRESH_TOKEN_EXPIRES_DAYS *24*60*60*1000
    )

    await db
        .insert(refreshTokens)
        .values({
            userId,
            tokenHash,
            expiresAt,
            userAgent: userAgent ?? null,
            ipAddress: ipAddress ?? null,
            updatedAt: new Date()
        })
    
    return rawToken
}

export const findValidRefreshToken = async (rawToken: string) => {
    const tokenHash = hashRefreshToken(rawToken)
    const [token] = await db
        .select()
        .from(refreshTokens)
        .where(and(
            eq(refreshTokens.tokenHash, tokenHash),
            eq(refreshTokens.isRevoked, false),
            eq(refreshTokens.expiresAt, new Date())
        ))
        .limit(1)

    return token ?? null
}

export const revokeRefreshToken = async (rawToken: string): Promise<void> => {
    const tokenHash = hashRefreshToken(rawToken)

    await db
        .update(refreshTokens)
        .set({
            isRevoked: true
        })
        .where(eq(refreshTokens.tokenHash, tokenHash))
}

export const revokeAllUserRefreshTokens = async (userId: string): Promise<void> => {
    await db
        .update(refreshTokens)
        .set({
            isRevoked: true
        })
        .where(eq(refreshTokens.userId, userId))
}

export const rotateRefreshToken = async(
    oldRawToken: string,
    userId: string,
    userAgent: string | undefined,
    ipAddress: string | undefined
): Promise<string | null> => {
    const oldTokenHash = hashRefreshToken(oldRawToken)

    return db.transaction(async (tx) => {
        const now = new Date()

        const [oldToken] = await tx
            .update(refreshTokens)
            .set({
                isRevoked: true,
                updatedAt: now
            })
            .where(and(
                eq(refreshTokens.tokenHash, oldTokenHash),
                eq(refreshTokens.userId, userId),
                eq(refreshTokens.isRevoked, false),
                gt(refreshTokens.expiresAt, now)
            ))
            .returning({id: refreshTokens.id})
        if (!oldToken) return null

        const newRawToken = generateRefreshToken()
        const newTokenHash= hashRefreshToken(newRawToken)

        const expiresAt = new Date(
            Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
        )

        await tx
            .insert(refreshTokens)
            .values({
                userId: userId,
                tokenHash: newTokenHash,
                userAgent: userAgent ?? null,
                ipAddress: ipAddress ?? null,
                expiresAt: expiresAt
            })
        return newRawToken
    })
}