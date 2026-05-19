import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"; // <-- Add Import

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    }),
);
app.use(express.json());

connectDB();

// Mounting Auth API Routes
app.use("/api/auth", authRoutes); // <-- Add Route Group

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Server Exception] ${err.stack}`);
    res.status(500).json({
        success: false,
        error:
            process.env.NODE_ENV === "production"
                ? "Internal Server Error"
                : err.message,
    });
});

app.listen(PORT, () => {
    console.log(`[Server] LogiSec Engine operating securely on port ${PORT}`);
});
