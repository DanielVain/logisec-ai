import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

interface JwtPayload {
    id: string;
}

export const protect = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            res.status(401).json({
                success: false,
                error: "Access denied. Security authentication token missing.",
            });
            return;
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET is unconfigured.");

        const decoded = jwt.verify(token, secret) as JwtPayload;

        // Attach user information to request stream
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            error: "Access denied. Security token has expired or is invalid.",
        });
    }
};
