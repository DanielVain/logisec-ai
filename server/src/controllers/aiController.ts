import { Response, NextFunction } from "express";
import { GoogleGenAI } from "@google/genai";
import { ChatSession, IMessage } from "../models/ChatSession.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";

export const handleChat = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { message, sessionId } = req.body;
        const userId = req.user?.id;

        if (!message) {
            res.status(400).json({
                success: false,
                error: "A prompt or input string is required.",
            });
            return;
        }

        // 1. Fetch or initialize the specific Chat Session in MongoDB
        let session = sessionId
            ? await ChatSession.findOne({ _id: sessionId, userId })
            : null;
        if (!session) {
            session = await ChatSession.create({
                userId,
                title: message.substring(0, 30) + "...",
                messages: [],
            });
        }

        // 2. Reconstruct the chat history for the standard contents array format
        const historyContents = session.messages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }));

        // Append the current fresh incoming user message to the historical chain
        historyContents.push({
            role: "user",
            parts: [{ text: message }],
        });

        // 3. LAZY INITIALIZE HERE: Ensures environment fallback is loaded before running
        const apiKey =
            process.env.GEMINI_API_KEY ||
            "AIzaSyAo3ajUcJ-SK_8TsWE3bfq_YaW_PUtF17M";
        const ai = new GoogleGenAI({ apiKey });

        // 4. Execute content generation with the correct config parameters
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: historyContents,
            config: {
                systemInstruction: `
                You are a seasoned Tier-3 Cyber Security Incident Response Analyst and expert SecOps Code Auditor. 
                Your primary responsibility is to analyze user inputs for critical vulnerabilities (OWASP Top 10, CWE elements, improper memory access, zero-day signatures, and hardcoded secrets).
                
                When code blocks are supplied:
                - Trace vulnerabilities explicitly.
                - Output a clear risk level (Low/Medium/High/Critical).
                - Provide a complete REMEDIATED, perfectly secure version of the code inside separate clean markdown blocks.
                
                Maintain a highly professional, defensive, authoritative security tone. Never output functional malware or exploit payloads; pivot strictly to mitigation engineering.
                `,
            },
        });

        const aiResponseText = response.text;
        if (!aiResponseText) {
            throw new Error(
                "Empty response received from the security analytics cluster engine.",
            );
        }

        // 5. Commit both the user prompt and agent response into the persistent database timeline
        const userMessage: IMessage = {
            sender: "user",
            content: message,
            timestamp: new Date(),
        };
        const agentMessage: IMessage = {
            sender: "agent",
            content: aiResponseText,
            timestamp: new Date(),
        };

        session.messages.push(userMessage, agentMessage);
        await session.save();

        res.status(200).json({
            success: true,
            sessionId: session._id,
            reply: aiResponseText,
        });
    } catch (error) {
        console.error("[AI Controller Error]:", error);
        next(error);
    }
};

export const getSessions = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const userId = req.user?.id;

        const sessions = await ChatSession.find({ userId })
            .select("title updatedAt createdAt")
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            sessions,
        });
    } catch (error) {
        next(error);
    }
};

export const getSessionMessages = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { sessionId } = req.params;
        const userId = req.user?.id;

        const session = await ChatSession.findOne({ _id: sessionId, userId });

        if (!session) {
            res.status(404).json({
                success: false,
                error: "Security assessment session not found.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            messages: session.messages,
        });
    } catch (error) {
        next(error);
    }
};
