import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateQuestions(userInput) {
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content: `
                        Purpose is to generate questions based on the topic given as a list
					`,
				},
				{
					role: "user",
					content: userInput,
				},
			],
		});

		const aiResponse = response.choices[0].message.content.trim();
		console.log("AI Response:", aiResponse);
		return aiResponse;
	} catch (error) {
		console.error("OpenAI API Error:", error);
		return "Sorry, I'm unable to process your request right now.";
	}
}

export default generateQuestions;
