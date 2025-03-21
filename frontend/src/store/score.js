import { create } from "zustand";

export const useScoreStore = create((set) => ({
	scores: [],
	setScores: (scores) => set({ scores }),

	createScore: async (newScore) => {
		const res = await fetch("/api/scores", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newScore),
		});

		const data = await res.json();
		set((state) => ({ scores: [...state.scores, data.data] }));
		return { success: true, message: "Score created successfully" };
	},

	fetchScores: async () => {
		const res = await fetch("/api/scores");
		const data = await res.json();

		set({ scores: data.data });
	},

	fetchScoreById: async (scoreId) => {
		const res = await fetch(`/api/scores/${scoreId}`);
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data.data;
	},

	fetchScoresByQuiz: async (quizId) => {
		const res = await fetch(`/api/scores/quiz/${quizId}`);
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data.data;
	},

	fetchScoresByStudent: async (emailId) => {
		try {
			const res = await fetch(`/api/scores/${emailId}`);
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to fetch scores");
			}

			console.log("Scores fetched:", data);
			return data;
		} catch (error) {
			console.error("Error fetching scores:", error.message);
			return [];
		}
	},

	updateScore: async (scoreId, updatedScore) => {
		const res = await fetch(`/api/scores/${scoreId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedScore),
		});
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		set((state) => ({
			scores: state.scores.map((score) => (score._id === scoreId ? data.data : score)),
		}));
		return { success: true, message: data.message };
	},

	deleteScore: async (scoreId) => {
		const res = await fetch(`/api/scores/${scoreId}`, {
			method: "DELETE",
		});
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		set((state) => ({
			scores: state.scores.filter((score) => score._id !== scoreId),
		}));
		return { success: true, message: "Score deleted successfully" };
	},
}));
