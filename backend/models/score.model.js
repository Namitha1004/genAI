import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema(
	{
		classroomId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Classroom",
			required: true,
		},

		learnerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Learner",
			required: true,
		},

		instructorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Instructor",
			required: true,
		},

		scores: [
			{
				questions: {
					type: String,
					required: true,
				},
				answers: {
					type: String,
					required: true,
				},
				gptScore: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],

		totalScore: {
			type: Number,
			required: true, // Must be calculated and passed during submission
		},

		comments: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

const Score = mongoose.model("Score", ScoreSchema);
export default Score;
