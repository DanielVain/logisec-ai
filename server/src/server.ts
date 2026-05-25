import path from "path";
import { fileURLToPath } from "url";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize environment variables immediately before // Try loading from the server folder first
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// If that failed, look one folder higher in the main project root
if (!process.env.MONGO_URI) {
    dotenv.config({ path: path.resolve(__dirname, "../../.env") });
}

// DEBUG LINE - Let's see if either path worked
console.log(
    "[DEBUG] Final Check -> Mongo:",
    !!process.env.MONGO_URI,
    "| Gemini:",
    !!process.env.GEMINI_API_KEY,
);
// Local system imports happen AFTER dotenv configures process.env
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app: Application = express();
const PORT = process.env.PORT || 5001;

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    }),
);
app.use(express.json());

connectDB();

// Mounting Router Systems
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

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
