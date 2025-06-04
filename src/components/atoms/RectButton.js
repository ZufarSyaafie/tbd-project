export default function RectButton({ children, className, ...props }) {
	return (
		<button
			className={`size-[25px] flex items-center justify-center rounded-[5px] text-4xl text-white transition-colors ${className}`}
			{...props}
		>
			{props.content}
			{children}
		</button>
	);
}
