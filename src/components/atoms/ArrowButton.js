import React from 'react';
import Image from 'next/image';

export default function ArrowButton({ direction, onClick, disabled = false }) {
	return (
		<button 
    		className={`arrow-button ${direction} transition-transform duration-300 ease-in-out ${
        	disabled 
            	? 'opacity-50 cursor-not-allowed' 
            	: 'hover:cursor-pointer hover:scale-125'
    		}`}
    		onClick={disabled ? undefined : onClick}
    		disabled={disabled}
    		type="button"
		>
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
