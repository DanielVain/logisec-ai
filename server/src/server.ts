import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { ChatSession } from "./models/ChatSession.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", /\.onrender\.com$/],
        methods: ["GET", "POST"],
        credentials: true,
    },
    transports: ["polling", "websocket"],
    allowEIO3: true,
});

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

io.on("connection", (socket) => {
    console.log(`[WebSocket] Secure socket line opened: ${socket.id}`);

    socket.on("send_message", async (data) => {
        try {
            const { message, sessionId, userId } = data;

            if (!message) {
                socket.emit("error", {
                    message: "Empty message string input.",
                });
                return;
            }

            let session = null;

            if (userId || sessionId) {
                session = sessionId
                    ? await ChatSession.findById(sessionId)
                    : null;

                if (!session && userId) {
                    session = await ChatSession.create({
                        userId,
                        title: message.substring(0, 30) + "...",
                        messages: [],
                    });
                }
            }

            const historyContents = session
                ? session.messages.map((msg) => ({
                      role: msg.sender === "user" ? "user" : "model",
                      parts: [{ text: msg.content }],
                  }))
                : [];

            historyContents.push({
                role: "user",
                parts: [{ text: message }],
            });

            const apiKey = process.env.GEMINI_API_KEY;
            const ai = new GoogleGenAI({ apiKey });

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: historyContents,
                config: {
                    systemInstruction:
                        "You are a Tier-3 Cyber Security Incident Response Analyst. Trace vulnerabilities, provide a risk level (Low to Critical), and offer remediated code alternatives inside clean markdown code blocks.",
                },
            });

            const aiText =
                response.text ||
                "Operational analysis returned an empty execution path.";

            if (session) {
                session.messages.push(
                    { sender: "user", content: message, timestamp: new Date() },
                    { sender: "agent", content: aiText, timestamp: new Date() },
                );
                await session.save();
            }

            socket.emit("receive_message", {
                sessionId: session ? session._id : null,
                sender: "agent",
                content: aiText,
                timestamp: new Date(),
            });
        } catch (err: any) {
            console.error("[WebSocket Error]:", err);
            socket.emit("error", {
                message: "Failed to process security audit request.",
            });
        }
    });

    socket.on("disconnect", () => {
        console.log(`[WebSocket] Socket pipeline disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 10000;
httpServer.listen(PORT, () => {
    console.log(
        `[Server] Core infrastructure operating securely on port ${PORT}`,
    );
});

if (process.env.NODE_ENV === "production") {
    // Point to the built static files inside the client folder
    const clientBuildPath = path.join(__dirname, "client", "dist");
    app.use(express.static(clientBuildPath));

    // Fallback catch-all: route everything else straight to React's index.html
    app.get("*", (req, res) => {
        res.sendFile(path.join(clientBuildPath, "index.html"));
    });
}
