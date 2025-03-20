import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
	name: {
		type: String,
		// required: true,
	},
	classroomId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Classroom",
		required: true,
	},

	questions: [
		{
			type: String,
		},
	],

	answers: [
		{
			type: String,
		},
	],
});

const Quiz = mongoose.model("Quiz", QuizSchema);
export default Quiz;
