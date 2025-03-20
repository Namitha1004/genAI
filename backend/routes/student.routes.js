import express from "express";

import {
	createStudent,
	getStudents,
	getStudentById,
	deleteStudent,
	getParticipationByStudent,
	getStudentByEmail,
} from "../controllers/student.controller.js";

const router = express.Router();

router.get("/", getStudents);
router.get("/:studentId", getStudentById);
router.get("/participation-record/:studentId", getParticipationByStudent);
router.post("/", createStudent);
router.post("/email", getStudentByEmail);
router.delete("/:id", deleteStudent);

export default router;
