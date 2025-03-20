import mongoose from "mongoose";

const CustomQuizSchema = new mongoose.Schema({
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

	learnerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Learner",
		required: true,
	},

	customQuestions: [
		{
			type: String,
		},
	],
});

const CustomQuiz = mongoose.model("CustomQuiz", CustomQuizSchema);
export default CustomQuiz;
