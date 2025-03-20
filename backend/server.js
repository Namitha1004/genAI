import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import sampleRoutes from "./routes/sample.routes.js";
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import instructorRoutes from "./routes/instructor.routes.js";
import classroomRoutes from "./routes/classroom.routes.js";
import learnerRoutes from "./routes/learner.routes.js";

dotenv.config();
const port = process.env.PORT || 1001;
const app = express();

app.use(express.json());

app.use("/api/sample", sampleRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/learners", learnerRoutes);

app.get("/", (req, res) => {
	res.send("Server is ready");
});

app.listen(port, () => {
	connectDB();
	console.log(`Server is running on http://localhost:${port}`);
});
