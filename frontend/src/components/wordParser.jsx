import React, { useState } from "react";
import * as mammoth from "mammoth";

function WordReader() {
	const [text, setText] = useState("");

	// Handle file upload
	const handleFileUpload = (event) => {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = async (e) => {
				const arrayBuffer = e.target.result;

				// Extract text from the .docx file
				const result = await mammoth.extractRawText({ arrayBuffer });
				setText(result.value); // Set the extracted text to state
			};

			reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
		}
	};

	return (
		<div>
			<h1>Word Document Text Extractor</h1>
			<input type="file" accept=".docx" onChange={handleFileUpload} />
			<div>
				<h2>Extracted Text:</h2>
				<pre>{text}</pre>
			</div>
		</div>
	);
}

export default WordReader;
