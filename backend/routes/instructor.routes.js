import express from "express";

import {
	createInstructor,
	getInstructors,
	deleteInstructor,
	getAssignedStudents,
	addParticipantsToInstructor,
	getInstructorsForClassroom,
	updateInstructor,
} from "../controllers/instructor.controller.js";

const router = express.Router();

router.get("/", getInstructors);
router.get("/:classroomId", getInstructorsForClassroom);
router.get("/assigned-students/:instructorId", getAssignedStudents);
router.post("/", createInstructor);
router.delete("/:id", deleteInstructor);
router.put("/add-participants/:instructorId", addParticipantsToInstructor);
router.put("/:instructorId", updateInstructor);

export default router;
