import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, CircularProgress, Paper, Button, List, ListItem, ListItemText } from "@mui/material";
import { useClassroomStore } from "../../store/classroom";
import { useQuizStore } from "../../store/quiz";
import { AuthContext } from "../../context/AuthContext";

const QuizListPage = () => {
	const { classroomId } = useParams();
	const navigate = useNavigate();
	const { fetchClassroomById } = useClassroomStore();
	const { fetchQuizzesByClassroom } = useQuizStore();
	const { role } = useContext(AuthContext);

	const [classroom, setClassroom] = useState(null);
	const [quizzes, setQuizzes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadClassroomAndQuizzes = async () => {
			try {
				setLoading(true);
				setError("");

				// Fetch Classroom Data
				const classroomData = await fetchClassroomById(classroomId);
				if (classroomData) {
					setClassroom(classroomData);
				} else {
					setError("Classroom not found.");
					return;
				}

				// Fetch Quizzes Data
				const quizzesData = await fetchQuizzesByClassroom(classroomId);
				setQuizzes(quizzesData || []);
			} catch (error) {
				setError("Failed to load data.");
			} finally {
				setLoading(false);
			}
		};
		loadClassroomAndQuizzes();
	}, [classroomId, fetchClassroomById, fetchQuizzesByClassroom]);

	const handleNavigateToQuiz = (quizId) => {
		navigate(`/classroom/${classroomId}/quiz/${quizId}`);
	};

	const handleCreateQuiz = () => {
		navigate(`/classroom/${classroomId}/create-quiz`);
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
						Quizzes for {classroom.name}
					</Typography>

					{role === "teacher" && (
						<Button variant="contained" color="primary" onClick={handleCreateQuiz} sx={{ mb: 2 }}>
							Create Quiz
						</Button>
					)}

					{quizzes.length === 0 ? (
						<Typography>No quizzes found for this classroom.</Typography>
					) : (
						<List>
							{quizzes.map((quiz) => (
								<ListItem
									key={quiz._id}
									sx={{ borderBottom: "1px solid #ccc", cursor: "pointer" }}
									onClick={() => handleNavigateToQuiz(quiz._id)}
								>
									<ListItemText
										primary={quiz.title}
										secondary={`Created on: ${new Date(quiz.createdAt).toLocaleDateString()}`}
									/>
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

export default QuizListPage;
