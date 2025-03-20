import express from "express";

import { generatingQuestions } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/generate-questions", generatingQuestions);

export default router;
