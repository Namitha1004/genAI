import express from "express";

import {
	createLearner,
	getLearners,
	getLearnersByClassroom,
	getLearnerByStudentEmail,
	deleteLearner,
} from "../controllers/learner.controller.js";

const router = express.Router();

router.get("/", getLearners);
router.get("/:classroomId", getLearnersByClassroom);
router.post("/", createLearner);
router.post("/learner-by-email", getLearnerByStudentEmail);
router.delete("/:id", deleteLearner);

export default router;
