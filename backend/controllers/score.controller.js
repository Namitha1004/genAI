import Score from "../models/score.model.js";

// ✅ Create a Score
export const createScore = async (req, res) => {
	try {
		const { classroomId, email, quizId, scores } = req.body;

		if (!classroomId || !quizId || !scores === undefined) {
			return res.status(400).json({ error: "All required fields must be provided." });
		}

		const newScore = new Score({
			classroomId,
			email,
			quizId,
			scores,
			// comments,
		});

		await newScore.save();
		res.status(201).json({ success: true, message: "Score created successfully.", score: newScore });
	} catch (error) {
		console.error("Error creating score:", error);
		res.status(500).json({ error: "Internal server error." });
	}
};

// ✅ Get All Scores
export const getAllScores = async (req, res) => {
	try {
		const scores = await Score.find().populate("classroomId quizId");
		res.status(200).json({ success: true, scores });
	} catch (error) {
		console.error("Error fetching scores:", error);
		res.status(500).json({ error: "Internal server error." });
	}
};

// ✅ Get Score by ID
export const getScoreById = async (req, res) => {
	try {
		const { id } = req.params;

		const score = await Score.findById(id).populate("classroomId quizId");
		if (!score) {
			return res.status(404).json({ error: "Score not found." });
		}

		res.status(200).json({ success: true, score });
	} catch (error) {
		console.error("Error fetching score by ID:", error);
		res.status(500).json({ error: "Internal server error." });
	}
};

// ✅ Update Score by ID
export const updateScore = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;

		const updatedScore = await Score.findByIdAndUpdate(id, updates, { new: true });

		if (!updatedScore) {
			return res.status(404).json({ error: "Score not found." });
		}

		res.status(200).json({ message: "Score updated successfully.", score: updatedScore });
	} catch (error) {
		console.error("Error updating score:", error);
		res.status(500).json({ error: "Internal server error." });
	}
};

// ✅ Delete Score by ID
export const deleteScore = async (req, res) => {
	try {
		const { id } = req.params;

		const deletedScore = await Score.findByIdAndDelete(id);
		if (!deletedScore) {
			return res.status(404).json({ error: "Score not found." });
		}

		res.status(200).json({ message: "Score deleted successfully." });
	} catch (error) {
		console.error("Error deleting score:", error);
		res.status(500).json({ error: "Internal server error." });
	}
};

// ✅ Get Score by Learner ID and Quiz ID
export const getScoreByLearnerAndQuiz = async (req, res) => {
	try {
		const { learnerId, quizId } = req.params;

		const score = await Score.findOne({ learnerId, quizId }).populate("classroomId learnerId quizId");
		if (!score) {
			return res.status(404).json({ error: "Score not found for this learner and quiz." });
		}

		res.status(200).json(score);
	} catch (error) {
		console.error("Error fetching score:", error);
		res.status(500).json({ error: "Internal server error." });
	}
};

// ✅ Get All Scores for a Specific Quiz ID
export const getScoresByQuizId = async (req, res) => {
	try {
		const { quizId } = req.params;

		const scores = await Score.find({ quizId }).populate("classroomId learnerId quizId");
		if (scores.length === 0) {
			return res.status(404).json({ error: "No scores found for this quiz." });
		}

		res.status(200).json(scores);
	} catch (error) {
		console.error("Error fetching scores by quiz ID:", error);
		res.status(500).json({ error: "Internal server error." });
	}
};

export const getScoresByStudent = async (req, res) => {
	const { email } = req.params;
	try {
		const scores = await Score.find({ email })
			.populate("quizId", "scores") // Populate quiz title
			.sort({ createdAt: -1 });

		if (!scores.length) {
			return res.status(404).json({ error: "No scores found for this student" });
		}

		res.status(200).json(scores);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
