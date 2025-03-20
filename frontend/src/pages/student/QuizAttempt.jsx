import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuizStore } from "../../store/quiz";
import { useScoreStore } from "../../store/score";
import { Container, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const QuizAttempt = () => {
	const { classroomId, quizId } = useParams();
	const { fetchQuizById } = useQuizStore();
	const { createScore } = useScoreStore();
	const { user, role } = useContext(AuthContext);
	const [quiz, setQuiz] = useState(null);
	const [userAnswers, setUserAnswers] = useState({});
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);

	const OPENAI_API_KEY =
		"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"; // Replace this with your actual API key

	// Fetch quiz data
	useEffect(() => {
		const fetchQuiz = async () => {
			try {
				const data = await fetchQuizById(quizId);
				if (!data || !data.questions || !data.answers) {
					console.error("Invalid quiz data");
					return;
				}
				setQuiz(data);
			} catch (error) {
				console.error("Error fetching quiz:", error.message);
			}
		};
		fetchQuiz();
	}, [quizId, fetchQuizById]);

	// Handle user answer input
	const handleAnswerChange = (index, value) => {
		setUserAnswers((prev) => ({
			...prev,
			[index]: value,
		}));
	};

	// Submit answers, grade using GPT, and store the score
	const handleSubmit = async () => {
		if (!quiz) return;
		setLoading(true);

		const formattedData = quiz.questions.map((question, index) => ({
			question,
			userAnswer: userAnswers[index] || "",
			correctAnswer: quiz.answers[index] || "",
		}));

		try {
			// Send data to OpenAI for grading
			const response = await axios.post(
				"https://api.openai.com/v1/chat/completions",
				{
					model: "gpt-4o-mini",
					messages: [
						{
							role: "system",
							content: `
                You are a quiz grader. Grade the user's answers using the following format:
                [
                  {
                    "question": "Question?",
                    "userAnswer": "User's Answer",
                    "correctAnswer": "Correct Answer",
                    "score": "0 to 1 (based on accuracy)"
                  }
                ]
                Use logical evaluation based on answer accuracy, give partial marks where applicable.
              `,
						},
						{
							role: "user",
							content: JSON.stringify(formattedData),
						},
					],
				},
				{
					headers: {
						Authorization: `Bearer ${OPENAI_API_KEY}`,
						"Content-Type": "application/json",
					},
				}
			);

			const feedback = JSON.parse(response.data.choices[0].message.content.trim());
			console.log("Feedback:", feedback);
			setResults(feedback);

			// Calculate total and max score
			const totalScore = feedback.reduce((acc, item) => acc + Number(item.score), 0);
			console.log(totalScore);
			const maxScore = feedback.length;

			// Submit score to the backend
			await createScore({
				classroomId,
				email: user.email,
				quizId,
				scores: feedback,
			});

			alert("Score submitted successfully!");
		} catch (error) {
			console.error("Error:", error);
			alert("Failed to submit answers. Please try again.");
		}
		setLoading(false);
	};

	return (
		<Container>
			{quiz?.questions?.map((question, index) => (
				<div key={index} style={{ marginBottom: "20px" }}>
					<Typography variant="h6">
						{index + 1}. {question}
					</Typography>
					<TextField
						variant="outlined"
						fullWidth
						placeholder="Enter your answer"
						value={userAnswers[index] || ""}
						onChange={(e) => handleAnswerChange(index, e.target.value)}
					/>
				</div>
			))}
			<Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
				{loading ? <CircularProgress size={24} /> : "Submit Answers"}
			</Button>

			{results.length > 0 && (
				<div style={{ marginTop: "30px" }}>
					<Typography variant="h5">Results</Typography>
					{results.map((item, index) => (
						<div key={index}>
							<Typography>
								<strong>Question:</strong> {item.question}
							</Typography>
							<Typography>
								<strong>Your Answer:</strong> {item.userAnswer}
							</Typography>
							<Typography>
								<strong>Correct Answer:</strong> {item.correctAnswer}
							</Typography>
							<Typography>
								<strong>Score:</strong> {item.score}
							</Typography>
							<hr />
						</div>
					))}
				</div>
			)}
		</Container>
	);
};

export default QuizAttempt;
