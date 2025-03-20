import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
	classroomId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Classroom",
		required: true,
	},

	instructorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Instructor",
		required: true,
	},

	questions: [
		{
			type: String,
		},
	],
});

const Quiz = mongoose.model("Quiz", QuizSchema);
export default Quiz;
