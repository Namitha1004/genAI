import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema(
	{
		classroomId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Classroom",
			required: true,
		},

		// learnerId: {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	ref: "Learner",
		// 	required: true,
		// },
		email: {
			type: String,
			required: true,
		},

		quizId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Quiz",
			required: true,
		},

		scores: [
			{
				question: {
					type: String,
					required: true,
				},
				userAnswer: {
					type: String,
					required: true,
				},
				correctAnswer: {
					type: String,
					required: true,
				},
				score: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],

		totalScore: {
			type: Number,
		},
	},
	{ timestamps: true }
);

const Score = mongoose.model("Score", ScoreSchema);
export default Score;
