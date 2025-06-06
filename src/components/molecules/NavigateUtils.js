import ArrowButton from "../atoms/ArrowButton";
import React from "react";

export default function NavigateUtils({ 
	currentPage, 
	totalPages, 
	onPageChange, 
	totalItems,
	itemsPerPage,
	startIndex,
	endIndex 
}) {
	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	};

	return (
		<div className="flex items-center flex-row gap-2.5">
			<ArrowButton 
				direction="left" 
				onClick={handlePrevious}
				disabled={currentPage <= 1}
			/>
			<div className="text-[#99A1AF] text-lg font-bold flex items-center gap-2">
				{/* <span>{startIndex}-{endIndex}</span>
				<span className="text-sm">dari</span>
				<span>{totalItems}</span>
				<span className="text-sm mx-2">|</span>
				<span className="text-sm">Halaman</span> */}
				<span>{currentPage}/{totalPages}</span>
			</div>
			<ArrowButton 
				direction="right" 
				onClick={handleNext}
				disabled={currentPage >= totalPages}
			/>
		</div>
	);
}
