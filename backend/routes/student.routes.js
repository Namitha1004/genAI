import express from "express";

import { createStudent, getStudents, getStudentById, deleteStudent } from "../controllers/student.controller.js";

const router = express.Router();

router.get("/", getStudents);
router.get("/:studentId", getStudentById);
router.post("/", createStudent);
router.delete("/:id", deleteStudent);

export default router;
