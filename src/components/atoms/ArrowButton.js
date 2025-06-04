import React from "react";
import Image from "next/image";

export default function ArrowButton({ direction }) {
	return (
		<button className={`arrow-button text-xl ${direction}`}>
			{direction === "left" && <Image src="/image/left-arrow.svg" alt="Left Arrow" width={12} height={12} />}
			{direction === "right" && <Image src="/image/right-arrow.svg" alt="Right Arrow" width={12} height={12} />}
		</button>
	);
}
