import express from "express";

import {
	createSample,
	getSamples,
	getParticularSample,
	deleteSample,
	updateSample,
} from "../controllers/sample.controller.js";

const router = express.Router();

router.get("/", getSamples);
router.get("/:id", getParticularSample);
router.post("/", createSample);
router.delete("/:id", deleteSample);
router.put("/:id", updateSample);

export default router;
