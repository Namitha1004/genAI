import { create } from "zustand";

export const useTeacherStore = create((set) => ({
	teachers: [],
	setTeachers: (teachers) => set({ teachers }),

	createTeacher: async (newTeacher) => {
		try {
			const res = await fetch("/api/teachers", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newTeacher),
			});
			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Failed to create teacher");

			set((state) => ({ teachers: [...state.teachers, data.data] }));
			return { success: true, message: "Teacher created successfully" };
		} catch (error) {
			console.error("Create Teacher Error:", error);
			return { success: false, message: error.message };
		}
	},

	fetchTeachers: async () => {
		try {
			const res = await fetch("/api/teachers");
			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Failed to fetch teachers");

			set({ teachers: data.data });
		} catch (error) {
			console.error("Fetch Teachers Error:", error);
		}
	},

	fetchTeacherById: async (teacherId) => {
		try {
			const res = await fetch(`/api/teachers/${teacherId}`);
			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Teacher not found");

			return data.data;
		} catch (error) {
			console.error("Fetch Teacher by ID Error:", error);
			return { success: false, message: error.message };
		}
	},

	findTeacher: async (emailId) => {
		try {
			const res = await fetch("/api/teachers/email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: emailId }),
			});
			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Teacher not found");

			return { success: true, data: data.data, message: "Teacher found successfully" };
		} catch (error) {
			console.error("Find Teacher Error:", error);
			return { success: false, message: error.message };
		}
	},

	fetchTeacherEvaluatorId: async (teacherId, eventId) => {
		try {
			const res = await fetch(`/api/teachers/${teacherId}/evaluator-id/${eventId}`);
			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Failed to fetch evaluator ID");

			return { success: true, data: data.data, message: "Teacher's evaluator ID found successfully" };
		} catch (error) {
			console.error("Fetch Teacher Evaluator ID Error:", error);
			return { success: false, message: error.message };
		}
	},

	fetchAvailableTeachers: async (eventId) => {
		try {
			const res = await fetch(`/api/teachers/available-teachers/${eventId}`);
			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Failed to fetch available teachers");

			return data.data;
		} catch (error) {
			console.error("Fetch Available Teachers Error:", error);
			return [];
		}
	},

	fetchEvaluationRecord: async (teacherId) => {
		try {
			const res = await fetch(`/api/teachers/evaluation-record/${teacherId}`);
			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Failed to fetch evaluation record");

			return data.data;
		} catch (error) {
			console.error("Fetch Evaluation Record Error:", error);
			return [];
		}
	},

	updateTeacher: async (teacherId, updatedTeacher) => {
		try {
			const res = await fetch(`/api/teachers/${teacherId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updatedTeacher),
			});
			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Failed to update teacher");

			set((state) => ({
				teachers: state.teachers.map((teacher) => (teacher._id === teacherId ? data.data : teacher)),
			}));

			return { success: true, message: "Teacher updated successfully" };
		} catch (error) {
			console.error("Update Teacher Error:", error);
			return { success: false, message: error.message };
		}
	},
}));
