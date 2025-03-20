import { create } from "zustand";

export const useClassroomStore = create((set) => ({
	classrooms: [],
	setClassrooms: (classrooms) => set({ classrooms }),

	createClassroom: async (newClassroom) => {
		try {
			const res = await fetch("/api/classrooms", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newClassroom),
			});

			const data = await res.json();
			if (!data.success) {
				return { success: false, message: data.message };
			}

			set((state) => ({ classrooms: [...state.classrooms, data.data] }));
			return { success: true, message: "Classroom created successfully" };
		} catch (error) {
			console.error("Error creating classroom:", error);
			return { success: false, message: "Server error" };
		}
	},

	fetchClassrooms: async () => {
		const res = await fetch("/api/classrooms");
		const data = await res.json();
		if (data.success) {
			set({ classrooms: data.data });
			return data.data; // ✅ Return data
		}
		return [];
	},

	fetchClassroomById: async (classroomId) => {
		try {
			const res = await fetch(`/api/classrooms/${classroomId}`);
			const data = await res.json();
			if (!data.success) {
				return { success: false, message: data.message };
			}
			return data.data;
		} catch (error) {
			console.error("Error fetching classroom by ID:", error);
			return { success: false, message: "Server error" };
		}
	},

	fetchAvailableStudents: async (classroomId) => {
		try {
			const res = await fetch(`/api/classrooms/available-students/${classroomId}`);
			const data = await res.json();
			if (!data.success) {
				return { success: false, message: data.message };
			}
			return data.data;
		} catch (error) {
			console.error("Error fetching available students:", error);
			return { success: false, message: "Server error" };
		}
	},

	addStudentsToClassroom: async (classroomId, studentList) => {
		try {
			const res = await fetch(`/api/classrooms/add-students/${classroomId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ studentIds: studentList }),
			});
			const data = await res.json();
			if (!data.success) {
				return { success: false, message: data.message };
			}

			set((state) => ({
				classrooms: state.classrooms.map((classroom) => (classroom._id === classroomId ? data.data : classroom)),
			}));
			return { success: true, message: data.message };
		} catch (error) {
			console.error("Error adding students to classroom:", error);
			return { success: false, message: "Server error" };
		}
	},

	// updateClassroom: async (classroomId, updatedClassroom) => {
	// 	try {
	// 		const res = await fetch(`/api/classrooms/${classroomId}`, {
	// 			method: "PUT",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify(updatedClassroom),
	// 		});
	// 		const data = await res.json();
	// 		if (!data.success) {
	// 			return { success: false, message: data.message };
	// 		}

	// 		set((state) => ({
	// 			classrooms: state.classrooms.map((classroom) => (classroom._id === classroomId ? data.data : classroom)),
	// 		}));
	// 		return { success: true, message: data.message };
	// 	} catch (error) {
	// 		console.error("Error updating classroom:", error);
	// 		return { success: false, message: "Server error" };
	// 	}
	// },
}));
