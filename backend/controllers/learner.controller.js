import mongoose from "mongoose";
import Learner from "../models/learner.model.js";
import Classroom from "../models/classroom.model.js";
import Student from "../models/student.model.js";

export const getLearners = async (req, res) => {
	try {
		const learners = await Learner.find({})
			.populate("classroomId", "name") // Populate classroom details
			.populate("student", "name email usn"); // Populate individual student details
		res.status(200).json({ success: true, data: learners });
	} catch (error) {
		console.error("Error fetching learners:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getLearnersByClassroom = async (req, res) => {
	const { classroomId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(classroomId)) {
		return res.status(400).json({ success: false, message: "Invalid classroom ID" });
	}

	try {
		const learners = await Learner.find({ classroomId: new mongoose.Types.ObjectId(classroomId) }).populate(
			"student",
			"name email usn"
		);

		res.status(200).json({ success: true, data: learners });
	} catch (error) {
		console.error("Error fetching learners:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createLearner = async (req, res) => {
	const { classroomId, student } = req.body;

	// Validate input
	if (!classroomId || !student) {
		return res.status(400).json({ success: false, message: "Classroom ID and Student ID are required" });
	}

	try {
		// Check if the classroom exists
		const classroom = await Classroom.findById(classroomId);
		if (!classroom) {
			return res.status(404).json({ success: false, message: "Classroom not found" });
		}

		// Check if the student exists
		const existingStudent = await Student.findById(student);
		if (!existingStudent) {
			return res.status(404).json({ success: false, message: "Student not found" });
		}

		// Create the learner
		const newLearner = new Learner({ classroomId, student });

		await newLearner.save();

		// Update learner count in the classroom
		classroom.learnerCount += 1;
		await classroom.save();

		res.status(201).json({ success: true, data: newLearner });
	} catch (error) {
		console.error("Error creating learner:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteLearner = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Learner ID" });
	}

	try {
		const learner = await Learner.findById(id);
		if (!learner) {
			return res.status(404).json({ success: false, message: "Learner not found" });
		}

		// Delete the learner
		await Learner.findByIdAndDelete(id);

		// Update learner count in the associated classroom
		const classroom = await Classroom.findById(learner.classroomId);
		if (classroom) {
			classroom.learnerCount -= 1;
			await classroom.save();
		}

		res.status(200).json({ success: true, message: "Learner deleted" });
	} catch (error) {
		console.error("Error deleting learner:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getLearnerByStudentEmail = async (req, res) => {
	try {
		const { email } = req.body; // Use req.body to send email
		if (!email) {
			return res.status(400).json({ success: false, message: "Email is required" });
		}

		// Find the student first
		const student = await Student.findOne({ email });
		if (!student) {
			return res.status(404).json({ success: false, message: "Student not found" });
		}

		// Find the learner using the student ID
		const learner = await Learner.findOne({ student: student._id });
		if (!learner) {
			return res.status(404).json({ success: false, message: "Learner not found" });
		}

		return res.status(200).json({ success: true, data: learner });
	} catch (error) {
		console.error("Error fetching learner by student email:", error);
		return res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};
