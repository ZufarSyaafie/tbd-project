import { useState, useCallback } from 'react';

export const usePagination = (initialPage = 1, initialItemsPerPage = 25) => {
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
	const [totalPages, setTotalPages] = useState(0);
	const [totalItems, setTotalItems] = useState(0);

	const goToPage = useCallback(
		(page) => {
			if (page >= 1 && page <= totalPages) {
				setCurrentPage(page);
			}
		},
		[totalPages]
	);

	const goToFirstPage = useCallback(() => {
		setCurrentPage(1);
	}, []);

	const goToLastPage = useCallback(() => {
		setCurrentPage(totalPages);
	}, [totalPages]);

	const goToNextPage = useCallback(() => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	}, [currentPage, totalPages]);

	const goToPreviousPage = useCallback(() => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	}, [currentPage]);

	const changeItemsPerPage = useCallback((newItemsPerPage) => {
		setItemsPerPage(newItemsPerPage);
		setCurrentPage(1); // Reset to first page when changing items per page
	}, []);

	return {
		currentPage,
		itemsPerPage,
		totalPages,
		totalItems,
		setTotalPages,
		setTotalItems,
		goToPage,
		goToFirstPage,
		goToLastPage,
		goToNextPage,
		goToPreviousPage,
		changeItemsPerPage,
	};
};
