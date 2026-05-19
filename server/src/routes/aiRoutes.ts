import { Router } from "express";
import {
    handleChat,
    getSessions,
    getSessionMessages,
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Route to handle sending messages and generating code audits
router.post("/analyze", protect, handleChat);

// Route to fetch the sidebar listing of all past audits
router.get("/sessions", protect, getSessions);

// Route to populate the chat window with a specific past session's data
router.get("/sessions/:sessionId", protect, getSessionMessages);

export default router;
