import React, { useContext, useEffect, useState } from "react";
import { Container, Typography, Paper, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useClassroomStore } from "../../store/classroom.js";

const HomePage = () => {
	const navigate = useNavigate();
	const { user, role } = useContext(AuthContext);
	const { fetchClassrooms } = useClassroomStore();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [classrooms, setClassrooms] = useState([]);

	useEffect(() => {
		const getClassrooms = async () => {
			try {
				const data = await fetchClassrooms();
				setClassrooms(data); // Store data
			} catch (err) {
				setError("Failed to fetch classrooms. Please try again later.");
			} finally {
				setLoading(false);
			}
		};
		getClassrooms();
	}, [fetchClassrooms]);

	const handleDoubleClick = (classroomId) => {
		if (role === "student") {
			navigate(`/student/classroom/${classroomId}`);
		} else {
			navigate(`/classroom/${classroomId}`);
		}
	};

	if (loading) {
		return (
			<Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
				<Typography variant="h6" color="error">
					{error}
				</Typography>
			</Box>
		);
	}

	return (
		!loading && (
			<Box
				sx={{
					minHeight: "100vh",
					background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
					color: "white",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					padding: 4,
				}}
			>
				<Container maxWidth="lg">
					{user && (
						<Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold", mb: 4 }}>
							Welcome, {user.email} ({role})
						</Typography>
					)}

					{!classrooms.length ? (
						<Typography variant="h6" sx={{ textAlign: "center", fontStyle: "italic" }}>
							No Classrooms Found
						</Typography>
					) : (
						<Container>
							{classrooms.map((classroom) => (
								<Box key={classroom._id} m="0 15px">
									<Paper
										elevation={6}
										sx={{
											width: "350px",
											height: "250px",
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											justifyContent: "center",
											backgroundColor: "rgba(255, 255, 255, 0.9)",
											color: "#333",
											borderRadius: 4,
											padding: 3,
											cursor: "pointer",
											transition: "transform 0.3s ease, box-shadow 0.3s ease",
											"&:hover": { transform: "scale(1.05)", boxShadow: 8 },
										}}
										onDoubleClick={() => handleDoubleClick(classroom._id)}
									>
										<Box
											sx={{
												width: "100%",
												height: "140px",
												background: `url("https://source.unsplash.com/350x140/?classroom") center/cover`,
												borderRadius: 2,
												mb: 2,
											}}
										/>
										<Typography variant="h6" sx={{ fontWeight: "bold" }}>
											{classroom.name}
										</Typography>
										<Typography variant="body2" sx={{ textAlign: "center" }}>
											{classroom.description?.length > 25
												? `${classroom.description.substring(0, 25)}...`
												: classroom.description}
										</Typography>
									</Paper>
								</Box>
							))}
						</Container>
					)}
				</Container>
			</Box>
		)
	);
};

export default HomePage;
