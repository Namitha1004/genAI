import React, { useState } from "react";
import axios from "axios";
import { useQuizStore } from "../../store/quiz"; // Adjust path as needed
import { useParams, useNavigate } from "react-router-dom";
import {
	Container,
	Typography,
	TextField,
	Button,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	CircularProgress,
	Grid,
	Card,
	CardContent,
} from "@mui/material";
import QuizIcon from "@mui/icons-material/Quiz"; // Icon for button

const StandardCreateQuizPage = () => {
	const navigate = useNavigate();
	const { createQuiz } = useQuizStore();
	const { classroomId } = useParams();
	const [topic, setTopic] = useState("");
	const [numQuestions, setNumQuestions] = useState(3);
	const [difficulty, setDifficulty] = useState("easy");
	const [questions, setQuestions] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchQuizQuestions = async () => {
		if (!topic.trim()) {
			alert("Please enter a topic.");
			return;
		}

		setLoading(true);

		try {
			const response = await axios.post(
				"https://api.openai.com/v1/chat/completions",
				{
					model: "gpt-4o-mini",
					messages: [
						{
							role: "system",
							content: `Generate ${numQuestions} short-answer questions on the topic "${topic}" with ${difficulty} difficulty.
                            Provide each question with a corresponding short answer in JSON format like:
                            [
                              {"question": "Question 1?", "answer": "Answer 1"},
                              {"question": "Question 2?", "answer": "Answer 2"}
                            ]`,
						},
					],
					temperature: 0.7,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer YOUR_OPENAI_API_KEY`, // Store securely
					},
				}
			);

			const content = response.data.choices?.[0]?.message?.content;
			if (!content) throw new Error("Invalid API response. No content received.");
			const extractedQuestions = JSON.parse(content);

			if (!Array.isArray(extractedQuestions)) {
				throw new Error("Invalid format. Expected an array of questions.");
			}

			setQuestions(extractedQuestions);

			// Prepare quiz details
			const quizDetails = {
				name: `${topic} Quiz`,
				classroomId,
				questions: extractedQuestions.map((q) => q.question),
				answers: extractedQuestions.map((q) => q.answer),
			};

			// Send data to backend using Zustand
			const { success, message } = await createQuiz(quizDetails);

			if (success) {
				alert("Quiz created successfully!");
				navigate(`/classroom/${classroomId}`);
			} else {
				alert(`Failed to save quiz: ${message}`);
			}
		} catch (error) {
			console.error("Error fetching questions:", error);
			alert(error.message || "Failed to fetch questions. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
			<Typography variant="h4" gutterBottom>
				Generate AI-Powered Questions
			</Typography>

			<TextField
				label="Enter a topic (e.g., Space, AI)"
				variant="outlined"
				fullWidth
				value={topic}
				onChange={(e) => setTopic(e.target.value)}
				sx={{ mb: 2 }}
			/>

			<TextField
				label="Number of Questions"
				type="number"
				variant="outlined"
				fullWidth
				value={numQuestions}
				onChange={(e) => setNumQuestions(Number(e.target.value))}
				inputProps={{ min: 1, max: 10 }}
				sx={{ mb: 2 }}
			/>

			<FormControl fullWidth sx={{ mb: 2 }}>
				<InputLabel>Difficulty Level</InputLabel>
				<Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
					<MenuItem value="easy">Easy</MenuItem>
					<MenuItem value="medium">Medium</MenuItem>
					<MenuItem value="hard">Hard</MenuItem>
				</Select>
			</FormControl>

			<Button
				variant="contained"
				color="primary"
				fullWidth
				startIcon={<QuizIcon />}
				onClick={fetchQuizQuestions}
				disabled={loading}
				sx={{ mb: 3 }}
			>
				{loading ? <CircularProgress size={24} /> : "Generate Questions"}
			</Button>

			{questions.length > 0 && (
				<Card elevation={3} sx={{ mt: 3, textAlign: "left" }}>
					<CardContent>
						<Typography variant="h5" gutterBottom>
							Generated Questions:
						</Typography>
						<Grid container spacing={2}>
							{questions.map((q, index) => (
								<Grid item xs={12} key={index}>
									<Typography variant="subtitle1">
										<strong>Q{index + 1}:</strong> {q.question}
									</Typography>
									<Typography variant="body2" color="textSecondary">
										<strong>Answer:</strong> {q.answer}
									</Typography>
								</Grid>
							))}
						</Grid>
					</CardContent>
				</Card>
			)}
		</Container>
	);
};

export default StandardCreateQuizPage;
