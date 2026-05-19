import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const generateToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error("JWT_SECRET is missing from environmental variables.");

    return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
};

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                error: "Email and password are required fields.",
            });
            return;
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(409).json({
                success: false,
                error: "A user account with this email already exists.",
            });
            return;
        }

        const newUser = await User.create({ email, passwordHash: password });
        const token = generateToken(newUser._id as unknown as string);

        res.status(201).json({
            success: true,
            token,
            user: { id: newUser._id, email: newUser.email },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                error: "Email and password are required fields.",
            });
            return;
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({
                success: false,
                error: "Invalid security credentials provided.",
            });
            return;
        }

        const token = generateToken(user._id as unknown as string);

        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, email: user.email },
        });
    } catch (error) {
        next(error);
    }
};
