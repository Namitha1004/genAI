import mongoose from "mongoose";

const InstructorSchema = new mongoose.Schema({
	classroomId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Classroom",
		required: true,
	},

	teacherId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Teacher",
		required: true,
	},
});

const Instructor = mongoose.model("Instructor", InstructorSchema);
export default Instructor;
