import React, { useState } from "react";
import "./FlashCards.css";

const Flashcard = ({ frontContent, backContent }) => {
	const [isFlipped, setIsFlipped] = useState(false);

	const handleClick = () => {
		setIsFlipped(!isFlipped);
	};

	return (
		<div className={`flashcard ${isFlipped ? "flipped" : ""}`} onClick={handleClick}>
			<div className="flashcard-inner">
				<div className="flashcard-front">{frontContent}</div>
				<div className="flashcard-back">{backContent}</div>
			</div>
		</div>
	);
};

export default Flashcard;
