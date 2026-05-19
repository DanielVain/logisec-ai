import { Router } from "express";
import { handleChat } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Protect the analytics route with our JWT middleware security blanket
router.post("/analyze", protect, handleChat);

export default router;
