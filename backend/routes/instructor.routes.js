import express from "express";

import { createInstructor, getInstructors, deleteInstructor } from "../controllers/instructor.controller.js";

const router = express.Router();

router.get("/", getInstructors);
router.post("/", createInstructor);
router.delete("/:id", deleteInstructor);

export default router;
