import express from "express";

import {
	createLearner,
	getLearners,
	getLearnersByClassroom,
	deleteLearner,
} from "../controllers/learner.controller.js";

const router = express.Router();

router.get("/", getLearners);
router.get("/:classroomId", getLearnersByClassroom);
router.post("/", createLearner);
router.delete("/:id", deleteLearner);

export default router;
