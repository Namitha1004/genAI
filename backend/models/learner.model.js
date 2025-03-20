import mongoose from "mongoose";

const LearnerSchema = new mongoose.Schema({
	classroomId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Event",
		required: true,
	},

	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Student",
		required: false,
	},
});

const Learner = mongoose.model("Learner", LearnerSchema);
export default Learner;
