import express from "express";
import {
	createScore,
	getAllScores,
	getScoreById,
	getScoreByLearnerAndQuiz,
	getScoresByQuizId,
	getScoresByStudent,
	updateScore,
	deleteScore,
} from "../controllers/score.controller.js";

const router = express.Router();

router.post("/", createScore); // Create a score
router.get("/", getAllScores); // Get all scores
router.get("/:email", getScoresByStudent); // Get all scores
router.get("/:id", getScoreById); // Get a score by ID
router.get("/learner/:learnerId/quiz/:quizId", getScoreByLearnerAndQuiz); // Get score by learner & quiz
router.get("/quiz/:quizId", getScoresByQuizId); // Get all scores for a quiz
router.put("/:id", updateScore); // Update a score by ID
router.delete("/:id", deleteScore); // Delete a score by ID

export default router;
