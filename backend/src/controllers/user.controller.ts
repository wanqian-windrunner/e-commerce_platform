import type { Request, Response, NextFunction } from "express";
import { getUserProfile } from "../services/user.service.js";

export const getCurrentUser = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "Authentication required"
        })
        return
    }

    try {
        const user = await getUserProfile(req.user.id)

        res.status(200).json({
            success: true,
            data: { user }
        })
    } catch (error) {
        next(error)
    }
}
