import React, { useState } from "react";
import axios from "axios";
import Flashcard from "./FlashCards";

const FlashcardGenerator = () => {
	const [topic, setTopic] = useState("");
	const [flashcards, setFlashcards] = useState([]);
	const [loading, setLoading] = useState(false);

	const OPENAI_API_KEY =
		"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";

	const generateFlashcards = async () => {
		if (!topic.trim()) {
			alert("Please enter a topic.");
			return;
		}

		setLoading(true);

		try {
			const response = await axios.post(
				"https://api.openai.com/v1/chat/completions",
				{
					model: "gpt-4",
					messages: [
						{
							role: "system",
							content: `Generate 5 flashcards on the topic "${topic}". Each flashcard should have a question on the front and a detailed answer on the back in JSON format like:
              [
                {"question": "Question 1", "answer": "Answer 1"},
                {"question": "Question 2", "answer": "Answer 2"},
                ...
              ]`,
						},
					],
					temperature: 0.7,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${OPENAI_API_KEY}`,
					},
				}
			);

			const content = response.data.choices?.[0]?.message?.content;
			if (!content) throw new Error("Invalid API response. No content received.");

			const generatedFlashcards = JSON.parse(content);
			if (!Array.isArray(generatedFlashcards)) {
				throw new Error("Invalid format. Expected an array of flashcards.");
			}

			setFlashcards(generatedFlashcards);
		} catch (error) {
			console.error("Error generating flashcards:", error);
			alert(error.message || "Failed to generate flashcards. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<h2>Flashcard Generator</h2>
			<input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter a topic" />
			<button onClick={generateFlashcards} disabled={loading}>
				{loading ? "Generating..." : "Generate Flashcards"}
			</button>

			<div className="flashcard-container">
				{flashcards.map((card, index) => (
					<Flashcard key={index} frontContent={card.question} backContent={card.answer} />
				))}
			</div>
		</div>
	);
};

export default FlashcardGenerator;
