export const LoadingSpinner = ({ message = 'Memuat data...' }) => {
	return (
		<div className="w-full p-8 text-center">
			<div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-r-2 border-[#99A1AF]"></div>
			<p className="mt-2 text-gray-600">{message}</p>
		</div>
	);
};
