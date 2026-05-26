import { Router } from "express";
import {
    handleChat,
    getSessions,
    getSessionMessages,
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/analyze", protect, handleChat);

router.get("/sessions", protect, getSessions);

router.get("/sessions/:sessionId", protect, getSessionMessages);

export default router;
