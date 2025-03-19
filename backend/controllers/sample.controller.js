import mongoose from "mongoose";
import Sample from "../models/sample.model.js";

export const getSamples = async (req, res) => {
	try {
		const samples = await Sample.find({});
		res.status(200).json({ success: true, data: samples });
	} catch (error) {
		console.error("Error loading data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getParticularSample = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		res.status(404).json({ success: false, message: "Invalid ObjectID" });
	}
	try {
		const sample = await Sample.findById(id);
		if (!sample) {
			return res.status(404).json({ success: false, message: "Sample Not Found" });
		}
		res.status(200).json({ success: true, data: sample });
	} catch (error) {
		console.error("Error loading the sample data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createSample = async (req, res) => {
	const newSample = new Sample(req.body);

	try {
		await newSample.save();
		res.status(200).json({ success: true, data: newSample });
	} catch (error) {
		console.error("Error in creating an Sample");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteSample = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Object ID" });
	}

	try {
		if (!Sample.findById(id)) {
			return res.status(404).json({ success: false, message: "Sample not found" });
		}

		await Sample.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Sample Deleted" });
	} catch (error) {
		console.error("Error in deleting the Sample");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const updateSample = async (req, res) => {
	const { id } = req.params;
	const sample = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid ObjectID" });
	}

	try {
		const updatedSample = await Sample.findByIdAndUpdate(id, sample, { new: true });

		if (!updatedSample) {
			return res.status(404).json({ success: false, message: "Sample not found" });
		}
		res.status(200).json({ success: true, data: updatedSample });
	} catch (error) {
		console.error("Update was unsuccessful");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
