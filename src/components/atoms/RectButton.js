export default function RectButton({ children, className, ...props }) {
	return (
		<button
			className={`size-[25px] flex items-center justify-center rounded-md text-4xl transition-colors ${className}`}
			{...props}
		>
			{props.content}
			{children}
		</button>
	);
}
