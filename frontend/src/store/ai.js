import { create } from "zustand";

const handleGenerateQuestions = async () => {
	if (!input.trim() || loading) return; // Prevent sending if input is empty or already processing
	setInput(""); // Clear input field

	setMessages((prev) => [...prev, { role: "user", content: input }]);
	setLoading(true); // Disable the button

	try {
		const response = await fetch("/api/ai/generate-questions", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message: input }),
		});
		const data = await response.json();
		console.log(data);

		setMessages((prev) => [...prev, { role: "bot", content: data.data }]);
	} catch (error) {
		console.error("Error fetching chatbot response:", error);
		setMessages((prev) => [...prev, { role: "bot", content: "Sorry, I couldn't process your request." }]);
	} finally {
		setLoading(false); // Enable the button again
	}
};
