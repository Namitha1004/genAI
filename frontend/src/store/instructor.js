import { create } from "zustand";

export const useEvaluatorStore = create((set) => ({
	evaluators: [],
	setEvaluators: (evaluators) => set({ evaluators }),

	createEvaluator: async (newEvaluator) => {
		try {
			const res = await fetch("/api/evaluators", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newEvaluator),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to create evaluator");

			set((state) => ({ evaluators: [...state.evaluators, data.data] }));
			return { success: true, message: "Evaluator created successfully" };
		} catch (error) {
			console.error("Create Evaluator Error:", error);
			return { success: false, message: error.message };
		}
	},

	fetchEvaluators: async () => {
		try {
			const res = await fetch("/api/evaluators");
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to fetch evaluators");

			set({ evaluators: data.data });
		} catch (error) {
			console.error("Fetch Evaluators Error:", error);
		}
	},

	fetchEvaluatorById: async (evaluatorId) => {
		try {
			const res = await fetch(`/api/evaluators/${evaluatorId}`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Evaluator not found");

			return data.data;
		} catch (error) {
			console.error("Fetch Evaluator by ID Error:", error);
			return { success: false, message: error.message };
		}
	},

	fetchEvaluatorsByEvent: async (eventId) => {
		try {
			const res = await fetch(`/api/evaluators/${eventId}`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to fetch evaluators for the event");

			return data.data;
		} catch (error) {
			console.error("Fetch Evaluators by Event Error:", error);
			return [];
		}
	},

	fetchAssignedStudents: async (evaluatorId) => {
		try {
			const res = await fetch(`/api/evaluators/assigned-students/${evaluatorId}`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to fetch assigned students");

			return data.data;
		} catch (error) {
			console.error("Fetch Assigned Students Error:", error);
			return [];
		}
	},

	updateEvaluator: async (evaluatorId, updatedEvaluator) => {
		try {
			const res = await fetch(`/api/evaluators/${evaluatorId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updatedEvaluator),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to update evaluator");

			set((state) => ({
				evaluators: state.evaluators.map((evaluator) => (evaluator._id === evaluatorId ? data.data : evaluator)),
			}));

			return { success: true, message: "Evaluator updated successfully" };
		} catch (error) {
			console.error("Update Evaluator Error:", error);
			return { success: false, message: error.message };
		}
	},

	// addParticipantsToEvaluator: async (evaluatorId, participantList) => {
	// 	try {
	// 		const res = await fetch(`/api/evaluators/add-participants/${evaluatorId}`, {
	// 			method: "PUT",
	// 			headers: { "Content-Type": "application/json" },
	// 			body: JSON.stringify({ participantIds: participantList }),
	// 		});

	// 		const data = await res.json();
	// 		if (!res.ok) throw new Error(data.message || "Failed to add participants");

	// 		set((state) => ({
	// 			evaluators: state.evaluators.map((evaluator) => (evaluator._id === evaluatorId ? data.data : evaluator)),
	// 		}));

	// 		return { success: true, message: "Participants added successfully" };
	// 	} catch (error) {
	// 		console.error("Add Participants to Evaluator Error:", error);
	// 		return { success: false, message: error.message };
	// 	}
	// },
}));
