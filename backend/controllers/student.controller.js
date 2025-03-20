import mongoose from "mongoose";
import Student from "../models/student.model.js";
import Learner from "../models/learner.model.js";
// import Learner from "../models/learner.model.js";

export const getStudents = async (req, res) => {
	try {
		const students = await Student.find({});
		res.status(200).json({ success: true, data: students });
	} catch (error) {
		console.error("Error in retrieving Students");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getStudentById = async (req, res) => {
	const { studentId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(studentId)) {
		res.status(404).json({ success: false, message: "Invalid ObjectID" });
	}
	try {
		const student = await Student.findById(studentId);
		if (!student) {
			return res.status(404).json({ success: false, message: "Student Not Found" });
		}
		res.status(200).json({ success: true, data: student });
	} catch (error) {
		console.error("Error loading the student data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getStudentByEmail = async (req, res) => {
	try {
		const { email } = req.body; // Use req.body instead of req.params
		if (!email) {
			return res.status(400).json({ success: false, message: "Email is required" });
		}

		const student = await Student.findOne({ email });

		if (!student) {
			return res.status(404).json({ success: false, message: "Student not found" });
		}

		console.log(student);
		res.status(200).json({ success: true, data: student });
	} catch (error) {
		console.error("Error fetching student by email:", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

export const createStudent = async (req, res) => {
	const newStudent = new Student(req.body);

	try {
		newStudent.save();
		res.status(200).json({ success: true, data: newStudent });
	} catch (error) {
		console.error("Error in creating Student");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteStudent = async (req, res) => {
	const { id } = req.params;
	console.log(id);
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Object ID" });
	}

	try {
		if (!Student.findById(id)) {
			return res.status(404).json({ success: false, message: "Student not found" });
		}
		await Student.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Student deleted" });
	} catch (error) {
		console.error("Error in deleting Student");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
