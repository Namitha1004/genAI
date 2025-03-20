import mongoose from "mongoose";
import Instructor from "../models/instructor.model.js";
import Classroom from "../models/classroom.model.js";
import Teacher from "../models/teacher.model.js";

export const getInstructors = async (req, res) => {
	try {
		const instructors = await Instructor.find({}).populate("classroomId", "name date").populate("teacherId", "name");
		res.status(200).json({ success: true, data: instructors });
	} catch (error) {
		console.error("Error loading data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getInstructorsForClassroom = async (req, res) => {
	const { classroomId } = req.params;

	try {
		// const assignedInstructors = await Instructor.find({ classroomId: new mongoose.Types.ObjectId(classroomId) });
		const assignedInstructors = await Instructor.find({
			classroomId: new mongoose.Types.ObjectId(classroomId),
		}).populate("teacherId", "name email");
		res.status(200).json({ success: true, data: assignedInstructors });
	} catch (error) {
		console.error("Error loading data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getAssignedStudents = async (req, res) => {
	const { instructorId } = req.params;

	try {
		console.log("Fetching assigned students for instructor and classroom...");

		// Await the query to resolve and fetch the instructor
		// const instructor = await Instructor.findOne({ _id: instructorId }).populate({
		// 	path: "assignedStudents",
		// 	populate: [
		// 		{ path: "student", select: "name usn" }, // individual student details
		// 		{ path: "members", select: "name usn" }, // team member details
		// 	],
		// });
		const instructor = await Instructor.findById(instructorId).populate({
			path: "assignedStudents",
			populate: [
				{ path: "student", select: "name usn" }, // individual student details
				{ path: "members", select: "name usn" }, // team member details
			],
		});

		if (!instructor) {
			return res.status(404).json({
				success: false,
				message: "Instructor not found for this classroom.",
			});
		}

		// assigned students data
		res.status(200).json({ success: true, data: instructor.assignedStudents });
	} catch (error) {
		// any unexpected errors
		console.error("Error fetching assigned students:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createInstructor = async (req, res) => {
	const { classroomId, teacherId } = req.body;

	const classroom = await Classroom.findById(classroomId);
	if (!classroom) {
		return res.status(404).json({ success: false, message: "Classroom not found" });
	}
	const teacher = await Teacher.findById(teacherId);
	if (!teacher) {
		return res.status(404).json({ success: false, message: "Teacher not found" });
	}

	const newInstructor = new Instructor(req.body);

	try {
		await newInstructor.save();
		res.status(200).json({ success: true, data: newInstructor });
	} catch (error) {
		console.error("Error in creating an Instructor");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteInstructor = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Object ID" });
	}

	try {
		if (!Instructor.findById(id)) {
			return res.status(404).json({ success: false, message: "Instructor not found" });
		}

		await Instructor.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Instructor Deleted" });
	} catch (error) {
		console.error("Error in deleting the Instructor");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const addParticipantsToInstructor = async (req, res) => {
	const { instructorId } = req.params;
	const { participantIds } = req.body; // Array of student IDs

	try {
		const instructor = await Instructor.findById(instructorId);
		if (!instructor) {
			return res.status(404).json({ success: false, message: "Instructor not found" });
		}

		// Add students to assignedStudents array
		instructor.assignedStudents.push(...participantIds);
		await instructor.save();

		res.status(200).json({ success: true, message: "Participants added successfully" });
	} catch (error) {
		console.error("Error adding participants to instructor:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const updateInstructor = async (req, res) => {
	const { instructorId } = req.params;
	const instructor = req.body;

	if (!mongoose.Types.ObjectId.isValid(instructorId)) {
		return res.status(404).json({ success: false, message: "Invalid ObjectID" });
	}

	try {
		const updatedInstructor = await Instructor.findByIdAndUpdate(instructorId, instructor, { new: true });

		if (!updatedInstructor) {
			return res.status(404).json({ success: false, message: "Classroom not found" });
		}
		res.status(200).json({ success: true, data: updatedInstructor });
	} catch (error) {
		console.error("Update was unsuccessful");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
