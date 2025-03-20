import express from "express";

import {
	createQuiz,
	getQuizzes,
	getQuizById,
	deleteQuiz,
	getQuizzesByClassroom,
	updateQuiz,
} from "../controllers/quiz.controller.js";

const router = express.Router();

router.get("/", getQuizzes);
router.get("/:id", getQuizById);
router.get("/classroom/:classroomId", getQuizzesByClassroom);
router.post("/", createQuiz);
router.delete("/:id", deleteQuiz);
router.put("/:id", updateQuiz);

export default router;
