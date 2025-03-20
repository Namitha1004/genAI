import { create } from "zustand";

export const useLearnerStore = create((set) => ({
	learners: [],
	setLearners: (learners) => set({ learners }),

	createLearner: async (newLearner) => {
		try {
			const res = await fetch("/api/learners", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newLearner),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to create learner");

			set((state) => ({ learners: [...state.learners, data.data] }));
			return { success: true, message: "Learner created successfully" };
		} catch (error) {
			console.error("Create Learner Error:", error);
			return { success: false, message: error.message };
		}
	},

	fetchLearners: async () => {
		try {
			const res = await fetch("/api/learners");
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to fetch learners");

			set({ learners: data.data });
		} catch (error) {
			console.error("Fetch Learners Error:", error);
		}
	},

	fetchLearnerById: async (learnerId) => {
		try {
			const res = await fetch(`/api/learners/${learnerId}`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Learner not found");

			return data.data;
		} catch (error) {
			console.error("Fetch Learner by ID Error:", error);
			return { success: false, message: error.message };
		}
	},

	fetchLearnersByClassroom: async (classroomId) => {
		try {
			const res = await fetch(`/api/learners/${classroomId}`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to fetch learners for the course");

			return data.data;
		} catch (error) {
			console.error("Fetch Learners by Course Error:", error);
			return [];
		}
	},

	fetchLearnerByEmail: async (email) => {
		try {
			const res = await fetch("/api/learners/learner-by-email/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(email),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to create learner");

			set((state) => ({ learners: [...state.learners, data.data] }));
			return { success: true, message: "Learner created successfully" };
		} catch (error) {
			console.error("Create Learner Error:", error);
			return { success: false, message: error.message };
		}
	},

	updateLearner: async (learnerId, updatedLearner) => {
		try {
			const res = await fetch(`/api/learners/${learnerId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updatedLearner),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to update learner");

			set((state) => ({
				learners: state.learners.map((learner) => (learner._id === learnerId ? data.data : learner)),
			}));

			return { success: true, message: "Learner updated successfully" };
		} catch (error) {
			console.error("Update Learner Error:", error);
			return { success: false, message: error.message };
		}
	},
}));
