import React from 'react';

export default function CircleButton({ children, className, ...props }) {
	return (
		<button
			className={`size-14 flex items-center justify-center rounded-full text-5xl text-white transition-colors ${className}`}
			{...props}
		>
			{props.content}
			{children}
		</button>
	);
}
