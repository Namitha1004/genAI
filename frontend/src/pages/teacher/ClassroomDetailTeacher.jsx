import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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

const ClassroomDetailPage = () => {
	const { classroomId } = useParams();
	const navigate = useNavigate();
	const { fetchClassroomById } = useClassroomStore();
	const { fetchLearnersByClassroom } = useLearnerStore();
	const { user, role } = useContext(AuthContext);

	const [classroom, setClassroom] = useState(null);
	const [learners, setLearners] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

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
			} catch (error) {
				setError("Failed to load classroom data.");
			} finally {
				setLoading(false);
			}
		};
		loadClassroom();
	}, [classroomId, fetchClassroomById]);

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
						{classroom.name}
					</Typography>
					<Typography variant="h6" color="textSecondary" gutterBottom>
						{classroom.description || "No description available."}
					</Typography>
					<Box marginTop={2}>
						<Typography variant="body1">{classroom.details}</Typography>
					</Box>

					{/* Create Quiz Button */}
					{role === "teacher" && (
						<>
							<Button
								variant="contained"
								color="secondary"
								onClick={() => navigate(`/classroom/${classroomId}/custom-quiz`)}
								sx={{ mt: 2, ml: 2 }}
							>
								Custom Quiz
							</Button>
							<Button
								variant="contained"
								color="secondary"
								onClick={() => navigate(`/classroom/${classroomId}/standard-quiz`)}
								sx={{ mt: 2, ml: 2 }}
							>
								Standard Quiz
							</Button>
						</>
					)}
					{role === "student" && (
						<>
							<Button
								variant="contained"
								color="primary"
								onClick={() => navigate(`/classroom/${classroomId}/custom-quiz`)}
								sx={{ mt: 2 }}
							>
								Custom Quiz
							</Button>
							<Button
								variant="contained"
								color="secondary"
								onClick={() => navigate(`/classroom/${classroomId}/standard-quiz`)}
								sx={{ mt: 2, ml: 2 }}
							>
								Standard Quiz
							</Button>
						</>
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
									<Link
										to={`/classroom/${classroomId}/learner/${learner?.student?.email}/scores`}
										style={{ marginLeft: "20px", textDecoration: "none", color: "#007bff" }}
									>
										View Scores
									</Link>
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

export default ClassroomDetailPage;
