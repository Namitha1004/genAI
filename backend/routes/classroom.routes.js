import express from "express";

import {
	createClassroom,
	getClassrooms,
	getParticularClassroom,
	deleteClassroom,
	updateClassroom,
	getUnassignedLearners,
	getAvailableStudentsForClassroom,
} from "../controllers/classroom.controller.js";

const router = express.Router();

router.get("/", getClassrooms);
router.get("/:id", getParticularClassroom);
router.get("/unassigned-learners/:classroomId", getUnassignedLearners);
router.get("/available-students/:classroomId", getAvailableStudentsForClassroom);
router.post("/", createClassroom);
router.delete("/:id", deleteClassroom);
router.put("/:id", updateClassroom);

export default router;
