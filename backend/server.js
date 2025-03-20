// server.js

import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import sampleRoutes from "./routes/sample.routes.js";
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import instructorRoutes from "./routes/instructor.routes.js";
import classroomRoutes from "./routes/classroom.routes.js";
import learnerRoutes from "./routes/learner.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import scoreRoutes from "./routes/score.routes.js";

dotenv.config();
const port = process.env.PORT || 1001;
const app = express();

app.use(express.json()); // Allow large PDF files

app.use("/api/sample", sampleRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/learners", learnerRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/scores", scoreRoutes);

// Mount the AI Routes
// app.use("/api/ai", aiRoutes); // This means the endpoint is now /api/ai/upload-pdf

app.get("/", (req, res) => {
	res.send("Server is ready");
});

import cors from "cors";

// Enable CORS
app.use(
	cors({
		origin: "http://localhost:5173", // Allow requests from your frontend
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
	})
);

app.listen(port, () => {
	connectDB();
	console.log(`Server is running on http://localhost:${port}`);
});
