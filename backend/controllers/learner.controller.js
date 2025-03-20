import mongoose from "mongoose";
import Learner from "../models/learner.model.js";
import Classroom from "../models/classroom.model.js";
import Student from "../models/student.model.js";

export const getLearners = async (req, res) => {
	try {
		const learners = await Learner.find({})
			.populate("classroomId", "name type date") // Populate classroom details
			.populate("student", "name email usn") // Populate individual student details
			.populate("members", "name email usn"); // Populate team members
		res.status(200).json({ success: true, data: learners });
	} catch (error) {
		console.error("Error fetching learners:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getLearnersByClassroom = async (req, res) => {
	const { classroomId } = req.params;
	try {
		const learners = await Learner.find({ classroomId: new mongoose.Types.ObjectId(classroomId) })
			.populate("student", "name email usn") // Populate individual student details
			.populate("members", "name email usn"); // Populate team members

		res.status(200).json({ success: true, data: learners });
	} catch (error) {
		console.error("Error fetching learners:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createLearner = async (req, res) => {
	const { classroomId, student, teamName, members } = req.body;

	// Check if the classroom exists
	const classroom = await Classroom.findById(classroomId);
	if (!classroom) {
		return res.status(404).json({ success: false, message: "Classroom not found" });
	}

	// Conditional validation
	if (classroom.teamClassroom) {
		// Ensure teamName and members are provided for team-based participation
		if (!teamName || !members || members.length === 0) {
			return res.status(400).json({
				success: false,
				message: "Team name and members are required for team-based participation",
			});
		}

		if (members.length > classroom.teamSize) {
			return res.status(400).json({ success: false, message: `Maximum team size is ${classroom.teamSize}.` });
		}
	} else {
		// Ensure student is provided for individual participation
		if (!student) {
			return res.status(400).json({
				success: false,
				message: "Student is required for individual participation",
			});
		}

		// Check if the student exists
		const existingStudent = await Student.findById(student);
		if (!existingStudent) {
			return res.status(404).json({ success: false, message: "Student not found" });
		}
	}

	// Create the learner
	const newLearner = new Learner({
		classroomId,
		student: classroom.teamClassroom ? undefined : student,
		teamName: classroom.teamClassroom ? teamName : undefined,
		members: classroom.teamClassroom ? members : undefined,
	});

	try {
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
