import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
// import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/shared/HomePage";
import ClassroomDetailPage from "./pages/teacher/ClassroomDetailTeacher";
import ClassroomDetailStudent from "./pages/student/ClassroomDetailStudent";
import QuizAttempt from "./pages/student/QuizAttempt";
import QuizAttemptv2 from "./pages/student/QuizAttemptv2";
import StandardCreateQuizPage from "./pages/teacher/StandardCreateQuizPage";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// import AuthCallback from "./context/AuthCallback.jsx";
// import LoginPage from "./pages/shared/LoginPage.jsx";
// import Register from "./pages/shared/Register.jsx";

function App() {
	const theme = createTheme({
		components: {
			MuiTextField: {
				styleOverrides: {
					root: {
						backgroundColor: "rgba(255, 255, 255, 0.9)", // Light background
						borderRadius: "5px", // Soft corners
						"& .MuiOutlinedInput-root": {
							input: { color: "black" }, // Ensure text is visible
							"& fieldset": { borderColor: "#fff" },
							"&:hover fieldset": { borderColor: "#333" },
							"&.Mui-focused fieldset": { borderColor: "#fff" },
						},
					},
				},
			},
			MuiInputLabel: {
				styleOverrides: {
					root: {
						color: "black",
						textShadow: "2px 2px 3px white, -2px -2px 3px white, 2px -2px 3px white, -2px 2px 3px white",
					},
				},
			},
		},
	});
	return (
		<>
			{/* <Navbar /> */}
			<ThemeProvider theme={theme} />
			<Box
				sx={{
					minHeight: "100vh",
					background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
					color: "white",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/classroom/:classroomId" element={<ClassroomDetailPage />} />
					<Route path="/student/classroom/:classroomId" element={<ClassroomDetailStudent />} />
					<Route path="/classroom/:classroomId/quiz/:quizId/attempt" element={<QuizAttempt />} />
					{/* <Route path="/classroom/:classroomId/quiz/:quizId/attempt" element={<QuizAttemptv2 />} /> */}
					<Route path="/classroom/:classroomId/create-quiz" element={<StandardCreateQuizPage />} />
					<Route path="/classroom/:classroomId/standard-quiz" element={<StandardCreateQuizPage />} />
					{/* <Route path="/auth/callback" element={<AuthCallback />} /> */}
					{/* <Route path="/login" element={<LoginPage />} /> */}
					{/* <Route path="/register" element={<Register />} /> */}
				</Routes>
			</Box>
		</>
	);
}

export default App;
