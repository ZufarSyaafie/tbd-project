import React from "react";

export default function ArrowButton({ direction }) {
	return (
		<button className={`arrow-button text-xl ${direction}`}>
			{direction === "left" && <span>{"◀️"}</span>}
			{direction === "right" && <span>{"▶️"}</span>}
		</button>
	);
}
