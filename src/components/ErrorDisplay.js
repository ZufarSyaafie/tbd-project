export const ErrorDisplay = ({ error, onRetry }) => {
	return (
		<div className="w-full p-8 text-center">
			<div className="mx-auto max-w-md">
				<div className="mb-4 text-4xl">⚠️</div>
				<p className="mb-4 text-[#FB64B6]">
					ERROR: {error?.message || 'An error occurred'}
				</p>
				{onRetry && (
					<button
						onClick={onRetry}
						className="rounded bg-[#FB64B6] px-4 py-2 text-white transition-colors duration-300 hover:bg-[#FF008A]"
					>
						Coba Lagi
					</button>
				)}
			</div>
		</div>
	);
};
