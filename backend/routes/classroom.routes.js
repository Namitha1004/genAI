import express from "express";

import {
	createClassroom,
	getClassrooms,
	getClassroomById,
	deleteClassroom,
} from "../controllers/classroom.controller.js";

const router = express.Router();

router.get("/", getClassrooms);
router.post("/", createClassroom);
router.delete("/:id", deleteClassroom);
router.get("/:id", getClassroomById);

export default router;
