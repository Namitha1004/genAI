import mongoose from "mongoose";
import Quiz from "../models/quiz.model.js";

// Create Quiz
export const createQuiz = async (req, res) => {
	const { name, classroomId, questions, answers } = req.body;

	if (!classroomId || !questions || !Array.isArray(questions)) {
		return res.status(400).json({ success: false, message: "Invalid data" });
	}

	try {
		const quiz = new Quiz({ name, classroomId, questions, answers });
		await quiz.save();
		res.status(201).json({ success: true, data: quiz });
	} catch (error) {
		console.error("Error creating Quiz:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

// Get All Quizzes
export const getQuizzes = async (req, res) => {
	try {
		const quizzes = await Quiz.find().populate("classroomId");
		res.status(200).json({ success: true, data: quizzes });
	} catch (error) {
		console.error("Error fetching Quizzes:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

// Get Quiz by ID
export const getQuizById = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Quiz ID" });
	}

	try {
		const quiz = await Quiz.findById(id).populate("classroomId");
		if (!quiz) {
			return res.status(404).json({ success: false, message: "Quiz not found" });
		}
		res.status(200).json({ success: true, data: quiz });
	} catch (error) {
		console.error("Error fetching Quiz:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getQuizzesByClassroom = async (req, res) => {
	const { classroomId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(classroomId)) {
		return res.status(400).json({ success: false, message: "Invalid Classroom ID" });
	}

	try {
		const quizzes = await Quiz.find({ classroomId });
		if (quizzes.length === 0) {
			return res.status(404).json({ success: false, message: "No quizzes found for this classroom" });
		}
		res.status(200).json({ success: true, data: quizzes });
	} catch (error) {
		console.error("Error fetching quizzes:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

// Update Quiz
export const updateQuiz = async (req, res) => {
	const { id } = req.params;
	const { questions, answers } = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Quiz ID" });
	}

	try {
		const quiz = await Quiz.findByIdAndUpdate(id, { questions, answers }, { new: true });
		if (!quiz) {
			return res.status(404).json({ success: false, message: "Quiz not found" });
		}
		res.status(200).json({ success: true, data: quiz });
	} catch (error) {
		console.error("Error updating Quiz:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

// Delete Quiz
export const deleteQuiz = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Quiz ID" });
	}

	try {
		const quiz = await Quiz.findByIdAndDelete(id);
		if (!quiz) {
			return res.status(404).json({ success: false, message: "Quiz not found" });
		}
		res.status(200).json({ success: true, message: "Quiz deleted successfully" });
	} catch (error) {
		console.error("Error deleting Quiz:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
