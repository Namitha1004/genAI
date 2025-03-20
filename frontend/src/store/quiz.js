import { create } from "zustand";

export const useQuizStore = create((set) => ({
	quizzes: [],
	setQuizzes: (quizzes) => set({ quizzes }),

	createQuiz: async (newQuiz) => {
		const res = await fetch("/api/quizzes", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newQuiz),
		});

		const data = await res.json();
		set((state) => ({ quizzes: [...state.quizzes, data.data] }));
		return { success: true, message: "Quiz created successfully" };
	},

	fetchQuizzes: async () => {
		const res = await fetch("/api/quizzes");
		const data = await res.json();

		set({ quizzes: data.data });
	},

	fetchQuizById: async (quizId) => {
		const res = await fetch(`/api/quizzes/${quizId}`);
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data.data;
	},

	fetchQuizzesByClassroom: async (classroomId) => {
		const res = await fetch(`/api/quizzes/classroom/${classroomId}`);
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data.data;
	},

	updateQuiz: async (quizId, updatedQuiz) => {
		const res = await fetch(`/api/quizzes/${quizId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedQuiz),
		});
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		set((state) => ({
			quizzes: state.quizzes.map((quiz) => (quiz._id === quizId ? data.data : quiz)),
		}));
		return { success: true, message: data.message };
	},

	deleteQuiz: async (quizId) => {
		const res = await fetch(`/api/quizzes/${quizId}`, {
			method: "DELETE",
		});
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		set((state) => ({
			quizzes: state.quizzes.filter((quiz) => quiz._id !== quizId),
		}));
		return { success: true, message: "Quiz deleted successfully" };
	},
}));
