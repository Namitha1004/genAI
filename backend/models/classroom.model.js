import mongoose from "mongoose";

const ClassroomSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String },
	learnerCount: { type: Number, default: 0 },
});

const Classroom = mongoose.model("Classroom", ClassroomSchema); // Ensure "Classroom" is used consistently
export default Classroom;
