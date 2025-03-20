import mongoose from "mongoose";
import Teacher from "../models/teacher.model.js";
import Instructor from "../models/instructor.model.js";

export const getTeachers = async (req, res) => {
	try {
		const teachers = await Teacher.find({});
		res.status(200).json({ success: true, data: teachers });
	} catch (error) {
		console.error("Error in retrieving Teachers");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getTeacherById = async (req, res) => {
	const { teacherId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(teacherId)) {
		res.status(404).json({ success: false, message: "Invalid ObjectID" });
	}
	try {
		const teacher = await Teacher.findById(teacherId);
		if (!teacher) {
			return res.status(404).json({ success: false, message: "Teacher Not Found" });
		}
		res.status(200).json({ success: true, data: teacher });
	} catch (error) {
		console.error("Error loading the teacher data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createTeacher = async (req, res) => {
	const newTeacher = new Teacher(req.body);

	try {
		newTeacher.save();
		res.status(200).json({ success: true, data: newTeacher });
	} catch (error) {
		console.error("Error in creating Teacher");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteTeacher = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Object ID" });
	}

	try {
		if (!Teacher.findById(id)) {
			return res.status(404).json({ success: false, message: "Teacher not found" });
		}
		await Teacher.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Teacher deleted" });
	} catch (error) {
		console.error("Error in deleting Teacher");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

// / Get available teachers (not assigned as instructors) for an classroom

export const getTeacherByEmail = async (req, res) => {
	try {
		const { email } = req.body; // Use req.body instead of req.params
		if (!email) {
			return res.status(400).json({ success: false, message: "Email is required" });
		}

		const teacher = await Teacher.findOne({ email });

		if (!teacher) {
			return res.status(404).json({ success: false, message: "Teacher not found" });
		}

		console.log(teacher);
		res.status(200).json({ success: true, data: teacher });
	} catch (error) {
		console.error("Error fetching teacher by email:", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

// export const getTeacherEvaluatorId = async (req, res) => {
// 	const { teacherId, classroomId } = req.params;

// 	try {
// 		const assignedInstructor = await Instructor.findOne({
// 			classroomId: new mongoose.Types.ObjectId(classroomId),
// 			teacherId: new mongoose.Types.ObjectId(teacherId),
// 		});

// 		if (!assignedInstructor) {
// 			return res.status(404).json({ message: "Instructor not found" });
// 		}

// 		res.status(200).json({ success: true, data: assignedInstructor._id });
// 	} catch (error) {
// 		console.error("Error fetching teacher's evaluation ID:", error);
// 		res.status(500).json({ success: false, message: "Internal Server Error" });
// 	}
// };
