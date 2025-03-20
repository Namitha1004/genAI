import mongoose from "mongoose";
import Classroom from "../models/classroom.model.js";
import Instructor from "../models/instructor.model.js";
import Student from "../models/student.model.js";
import Learner from "../models/learner.model.js";

export const getClassrooms = async (req, res) => {
	try {
		const classrooms = await Classroom.find({});
		res.status(200).json({ success: true, data: classrooms });
	} catch (error) {
		console.error("Error loading data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getParticularClassroom = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		res.status(404).json({ success: false, message: "Invalid ObjectID" });
	}
	try {
		const classroom = await Classroom.findById(id);
		if (!classroom) {
			return res.status(404).json({ success: false, message: "Classroom Not Found" });
		}
		res.status(200).json({ success: true, data: classroom });
	} catch (error) {
		console.error("Error loading the classroom data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getAvailableStudentsForClassroom = async (req, res) => {
	try {
		const { classroomId } = req.params;

		// Validate classroom ID
		if (!mongoose.Types.ObjectId.isValid(classroomId)) {
			return res.status(400).json({ success: false, message: "Invalid classroom ID" });
		}

		// Check if classroom exists
		const classroom = await Classroom.findById(classroomId);
		if (!classroom) {
			return res.status(404).json({ success: false, message: "Classroom not found" });
		}

		// Get all learners for the classroom
		const learners = await Learner.find({ classroomId: new mongoose.Types.ObjectId(classroomId) }).select(
			"student members"
		);

		// Extract IDs of students who are already learners
		const registeredStudentIds = new Set();
		learners.forEach((p) => {
			if (p.student) registeredStudentIds.add(p.student.toString()); // Individual learner
			else p.members.forEach((member) => registeredStudentIds.add(member.toString())); // Team members
		});

		// Find students who are NOT registered as learners
		const availableStudents = await Student.find({
			_id: { $nin: Array.from(registeredStudentIds) },
		}).select("name email usn"); // Modify fields as needed

		res.status(200).json({ success: true, data: availableStudents });
	} catch (error) {
		console.error("Error fetching available students:", error.message);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const createClassroom = async (req, res) => {
	const newClassroom = new Classroom(req.body);

	try {
		await newClassroom.save();
		res.status(200).json({ success: true, data: newClassroom });
	} catch (error) {
		console.error("Error in creating an Classroom");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteClassroom = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Object ID" });
	}

	try {
		if (!Classroom.findById(id)) {
			return res.status(404).json({ success: false, message: "Classroom not found" });
		}

		await Classroom.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Classroom Deleted" });
	} catch (error) {
		console.error("Error in deleting the Classroom");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const updateClassroom = async (req, res) => {
	const { id } = req.params;
	const classroom = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid ObjectID" });
	}

	try {
		const updatedClassroom = await Classroom.findByIdAndUpdate(id, classroom, { new: true });

		if (!updatedClassroom) {
			return res.status(404).json({ success: false, message: "Classroom not found" });
		}
		res.status(200).json({ success: true, data: updatedClassroom });
	} catch (error) {
		console.error("Update was unsuccessful");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

// export const getUnassignedLearners = async (req, res) => {
// 	try {
// 		const { classroomId } = req.params;
// 		const instructors = await Instructor.find({ classroomId: classroomId });

// 		// const assignedLearners = new Set(instructors.flatMap((e) => e.assignedStudents));
// 		const assignedLearners = instructors.reduce((set, instructor) => {
// 			if (Array.isArray(instructor.assignedStudents)) {
// 				instructor.assignedStudents.forEach((studentId) => set.add(studentId.toString()));
// 			}
// 			return set;
// 		}, new Set());
// 		const unassignedLearners = await Learner.find({ classroomId, _id: { $nin: [...assignedLearners] } })
// 			.populate("student")
// 			.populate("teamName");

// 		res.status(200).json({ success: true, data: unassignedLearners });
// 	} catch (error) {}
// };

export const getUnassignedLearners = async (req, res) => {
	try {
		const { classroomId } = req.params;

		// Get all assigned learner IDs from instructors
		const assignedLearners = new Set(
			(await Instructor.find({ classroomId })).flatMap((e) => e.assignedStudents.map(String))
		);

		// Fetch unassigned learners
		const unassignedLearners = await Learner.find({
			classroomId,
			_id: { $nin: [...assignedLearners] },
		})
			.populate("student")
			.populate("members");

		res.status(200).json({ success: true, data: unassignedLearners });
	} catch (error) {
		console.error("Error fetching unassigned learners:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
