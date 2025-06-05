import React from 'react';
import Image from 'next/image';

export default function ArrowButton({ direction }) {
	return (
		<button className={`arrow-button ${direction} hover:cursor-pointer hover:scale-125 transition-transform duration-300 ease-in-out`}>
			{direction === 'left' && (
				<Image
					src="/image/left-arrow.svg"
					alt="Left Arrow"
					width={15}
					height={15}
				/>
			)}
			{direction === 'right' && (
				<Image
					src="/image/right-arrow.svg"
					alt="Right Arrow"
					width={15}
					height={15}
				/>
			)}
		</button>
	);
}
