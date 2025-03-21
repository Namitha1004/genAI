import express from "express";

import { generatingQuestions, chatWithAI } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/generate-questions", generatingQuestions);
router.post("/chat", chatWithAI);

export default router;
