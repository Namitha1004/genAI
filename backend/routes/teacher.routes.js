import express from "express";

import {
	createTeacher,
	getTeachers,
	getAvailableTeachers,
	deleteTeacher,
	getEvaluationRecord,
	getTeacherById,
	getTeacherByEmail,
} from "../controllers/teacher.controller.js";

const router = express.Router();

router.get("/", getTeachers);
router.get("/:teacherId", getTeacherById);
router.get("/available-teachers/:eventId", getAvailableTeachers);
router.get("/evaluation-record/:teacherId", getEvaluationRecord);
router.post("/email", getTeacherByEmail);
router.post("/", createTeacher);
router.delete("/:id", deleteTeacher);

export default router;
