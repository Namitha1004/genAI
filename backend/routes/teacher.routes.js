import express from "express";

import {
	createTeacher,
	getTeachers,
	deleteTeacher,
	getTeacherById,
	getTeacherByEmail,
} from "../controllers/teacher.controller.js";

const router = express.Router();

router.get("/", getTeachers);
router.get("/:teacherId", getTeacherById);
router.post("/email", getTeacherByEmail);
router.post("/", createTeacher);
router.delete("/:id", deleteTeacher);

export default router;
