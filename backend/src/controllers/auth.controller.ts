import type { Request, Response, NextFunction } from "express"
import { loginUser, registerUser } from "../services/auth.service.js"
import { loginSchema, registerSchema } from "../validations/auth.validation.js"
import { refreshTokenCookieOptions } from "../utils/refreshTokenCookieOptions.js"
import { generateAccessToken } from "../utils/access-tokens.js"
import { findValidRefreshToken, revokeRefreshToken, rotateRefreshToken } from "../services/refresh-token.service.js"
import { findUserAuthState } from "../services/user.service.js"

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = registerSchema.safeParse(req.body)

    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid registration data",
            errors: validationResult.error.issues
        })
        return
    }

    try {
        const result = await registerUser(validationResult.data, req.get("user-agent"), req.ip)

        res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOptions)

        const { refreshToken: _refreshToken, ...loginData } = result

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: loginData
        })
    } catch (error) {
        next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = loginSchema.safeParse(req.body)

    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid login data",
            errors: validationResult.error.issues
        })
        return
    }

    try {
        const result = await loginUser(
            validationResult.data,
            req.get("user-agent"),
            req.ip
        )

        res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOptions)

        const { refreshToken: _refreshToken, ...loginData } = result

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: loginData
        })
    } catch (error) {
        next(error)
    }
}

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken as string | undefined

    if (!refreshToken) {
        res.status(401).json({
            success: false,
            message: "Refresh token is required"
        })
        return
    }

    try {
        const storedToken = await findValidRefreshToken(refreshToken)

        if (!storedToken) {
            res.clearCookie("refreshToken", refreshTokenCookieOptions)
            res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token"
            })
            return
        }

        const user = await findUserAuthState(storedToken.userId)

        if (!user || !user.isActive) {
            res.clearCookie("refreshToken", refreshTokenCookieOptions)
            res.status(401).json({
                success: false,
                message: "Invalid or inactive account"
            })
            return
        }

        const newRefreshToken = await rotateRefreshToken(
            refreshToken,
            storedToken.userId,
            req.get("user-agent"),
            req.ip
        )

        if (!newRefreshToken) {
            res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token"
            })
            return
        }

        const accessToken = generateAccessToken({
            sub: user.id,
            role: user.role
        })

        res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions)

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: { accessToken }
        })
    } catch (error) {
        next(error)
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken as string | undefined

    try {
        if (refreshToken) {
            await revokeRefreshToken(refreshToken)
        }

        res.clearCookie("refreshToken", refreshTokenCookieOptions)

        res.status(200).json({
            success: true,
            message: "Logout successful"
        })
    } catch (error) {
        next(error)
    }
}
