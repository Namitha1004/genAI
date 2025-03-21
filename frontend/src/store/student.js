import { create } from "zustand";

export const useStudentStore = create((set) => ({
	students: [],
	setStudents: (students) => set({ students }),

	createStudent: async (newStudent) => {
		try {
			const res = await fetch("/api/students", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newStudent),
			});
			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Failed to create student");

			set((state) => ({ students: [...state.students, data.data] }));
			return { success: true, message: "Student created successfully" };
		} catch (error) {
			console.error("Create Student Error:", error);
			return { success: false, message: error.message };
		}
	},

	findStudent: async (emailId) => {
		try {
			const res = await fetch("/api/students/email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: emailId }),
			});
			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Student not found");

			return { success: true, data: data.data, message: "Student found successfully" };
		} catch (error) {
			console.error("Find Student Error:", error);
			return { success: false, message: error.message };
		}
	},

	fetchStudents: async () => {
		try {
			const res = await fetch("/api/students");
			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Failed to fetch students");

			set({ students: data.data });
		} catch (error) {
			console.error("Fetch Students Error:", error);
		}
	},

	fetchStudentById: async (studentId) => {
		try {
			const res = await fetch(`/api/students/${studentId}`);
			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Student not found");

			return data.data;
		} catch (error) {
			console.error("Fetch Student by ID Error:", error);
			return { success: false, message: error.message };
		}
	},

	fetchParticipationRecord: async (studentId) => {
		try {
			const res = await fetch(`/api/students/participation-record/${studentId}`);
			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Failed to fetch participation record");

			return data.data;
		} catch (error) {
			console.error("Fetch Participation Record Error:", error);
			return [];
		}
	},

	updateStudent: async (studentId, updatedStudent) => {
		try {
			const res = await fetch(`/api/students/${studentId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updatedStudent),
			});
			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Failed to update student");

			set((state) => ({
				students: state.students.map((student) => (student._id === studentId ? data.data : student)),
			}));

			return { success: true, message: "Student updated successfully" };
		} catch (error) {
			console.error("Update Student Error:", error);
			return { success: false, message: error.message };
		}
	},
}));
