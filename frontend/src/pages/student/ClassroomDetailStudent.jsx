import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Container,
	Typography,
	CircularProgress,
	Box,
	Paper,
	Button,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import { useClassroomStore } from "../../store/classroom";
import { useLearnerStore } from "../../store/learner";
import { AuthContext } from "../../context/AuthContext";
import { useQuizStore } from "../../store/quiz"; // Assuming you have a quiz store

const ClassroomDetailStudent = () => {
	const { classroomId } = useParams(); // Classroom ID from URL
	const navigate = useNavigate();
	const { fetchClassroomById } = useClassroomStore();
	const { fetchLearnersByClassroom } = useLearnerStore();
	const { fetchQuizzesByClassroom } = useQuizStore(); // Function to fetch quizzes
	const { user, role } = useContext(AuthContext);

	const [classroom, setClassroom] = useState(null);
	const [learners, setLearners] = useState([]);
	const [quizzes, setQuizzes] = useState([]); // State to hold quizzes
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// Fetch Classroom Data
	useEffect(() => {
		const loadClassroom = async () => {
			try {
				setLoading(true);
				setError("");

				const classroomData = await fetchClassroomById(classroomId);
				if (classroomData) {
					setClassroom(classroomData);
				} else {
					setError("Classroom not found.");
				}

				const fetchLearnerByEmail = async () => {
					if (!user?.email) {
						setError("User email not found.");
						return null;
					}

					try {
						const res = await fetch("/api/learner-by-email", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ email: user.email }),
						});

						const data = await res.json();
						if (!data.success) {
							setError(data.message);
							return null;
						}

						console.log("Learner Data:", data.data);
						return data.data; // This will return the learner object
					} catch (error) {
						console.error("Error fetching learner by email:", error);
						setError("Failed to fetch learner.");
						return null;
					}
				};
			} catch (error) {
				setError("Failed to load classroom data.");
			} finally {
				setLoading(false);
			}
		};

		loadClassroom();
	}, [classroomId, fetchClassroomById]);

	// Fetch Learners Data
	useEffect(() => {
		const loadLearners = async () => {
			try {
				const learnersData = await fetchLearnersByClassroom(classroomId);
				if (learnersData) {
					setLearners(learnersData);
				}
			} catch (error) {
				setError("Failed to load learners.");
			}
		};

		loadLearners();
	}, [classroomId, fetchLearnersByClassroom]);

	// Fetch Quizzes Data
	useEffect(() => {
		const loadQuizzes = async () => {
			try {
				const quizzesData = await fetchQuizzesByClassroom(classroomId);
				if (quizzesData) {
					setQuizzes(quizzesData);
					console.log(quizzesData);
				}
			} catch (error) {
				setError("Failed to load quizzes.");
			}
		};

		loadQuizzes();
	}, [classroomId, fetchQuizzesByClassroom]);

	const handleCreateQuiz = () => {
		navigate(`/classroom/${classroomId}/create-quiz`);
	};

	const handleAttemptQuiz = (quizId) => {
		navigate(`/classroom/${classroomId}/quiz/${quizId}/attempt`);
	};

	if (loading) {
		return (
			<Container>
				<CircularProgress />
			</Container>
		);
	}

	if (error) {
		return (
			<Container>
				<Typography color="error">{error}</Typography>
			</Container>
		);
	}

	return (
		<Container>
			{classroom ? (
				<Paper elevation={3} style={{ padding: "20px" }}>
					<Typography variant="h4" gutterBottom>
						{classroom.topic}
					</Typography>
					<Typography variant="h6" color="textSecondary" gutterBottom>
						{classroom.description || "No description available."}
					</Typography>
					<Box marginTop={2}>
						<Typography variant="body1">{classroom.details}</Typography>
					</Box>

					{/* Create Quiz Button */}
					{role === "teacher" && (
						<Button variant="contained" color="primary" onClick={handleCreateQuiz} sx={{ mt: 2 }}>
							Create Quiz
						</Button>
					)}

					{/* Learners List */}
					<Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
						Learners in this Classroom
					</Typography>

					{learners.length === 0 ? (
						<Typography>No learners found for this classroom.</Typography>
					) : (
						<List>
							{learners.map((learner) => (
								<ListItem key={learner._id} sx={{ borderBottom: "1px solid #ccc" }}>
									<ListItemText
										primary={learner?.student?.name || "Unknown"}
										secondary={learner?.student?.email || "No email available"}
									/>
								</ListItem>
							))}
						</List>
					)}

					{/* Quizzes List */}
					<Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
						Quizzes
					</Typography>

					{quizzes.length === 0 ? (
						<Typography>No quizzes available for this classroom.</Typography>
					) : (
						<List>
							{quizzes.map((quiz) => (
								<ListItem key={quiz._id} sx={{ borderBottom: "1px solid #ccc" }}>
									<ListItemText primary={quiz.name} secondary={quiz.description || "No description available."} />
									<Button variant="contained" color="secondary" onClick={() => handleAttemptQuiz(quiz._id)}>
										Attempt Quiz
									</Button>
								</ListItem>
							))}
						</List>
					)}
				</Paper>
			) : (
				<Typography>No classroom details found.</Typography>
			)}
		</Container>
	);
};

export default ClassroomDetailStudent;
