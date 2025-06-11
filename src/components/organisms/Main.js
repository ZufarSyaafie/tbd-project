'use client';
import React, { useState, useRef, useCallback } from 'react';
import LeftUtils from '../molecules/LeftUtils';
import NavigateUtils from '../molecules/NavigateUtils';
import Table from '../molecules/Table';
import CompleteBookForm from './BookForm';
import BookDetail from './BookDetail';

export default function Main({ children }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selecteditemId, setSelecteditemId] = useState(null);
	const [selectedBookData, setSelectedBookData] = useState(null);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const refreshFunction = useRef(null);
	const getSuggestionsFunction = useRef(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(25);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [isChangingItemsPerPage, setIsChangingItemsPerPage] = useState(false);
	
	// Filter states
	const [activeFilters, setActiveFilters] = useState({});

	// Open add modal
	const openModal = useCallback(() => {
		setIsModalOpen(true);
	}, []);

	const closeModal = useCallback(() => {
		setIsModalOpen(false);
	}, []);

	// Open view modal
	const openViewModal = useCallback((itemId) => {
		setSelecteditemId(itemId);
		setIsViewModalOpen(true);
	}, []);

	const closeViewModal = useCallback(() => {
		setIsViewModalOpen(false);
		setSelecteditemId(null);
	}, []);

	// Open edit modal
	const openEditModal = useCallback((bookData) => {
		setSelectedBookData(bookData);
		setIsEditModalOpen(true);
	}, []);

	const closeEditModal = useCallback(() => {
		setIsEditModalOpen(false);
		setSelectedBookData(null);
	}, []);

	// Handler for refresh that will be called from LeftUtils
	const handleRefresh = useCallback(async () => {
		if (refreshFunction.current) {
			setIsRefreshing(true);
			try {
				await refreshFunction.current();
			} finally {
				setIsRefreshing(false);
			}
		}
	}, []);

	// Callback to receive refresh function from Table component
	const setRefreshFunction = useCallback((fn) => {
		refreshFunction.current = fn;
	}, []);

	// Callback to receive getSuggestions function from Table component
	const setGetSuggestionsFunction = useCallback((fn) => {
		getSuggestionsFunction.current = fn;
	}, []);

	const handleItemsPerPageChange = useCallback((newItemsPerPage) => {
		setIsChangingItemsPerPage(true);

		setItemsPerPage(newItemsPerPage);
		setCurrentPage(1);

		setTimeout(() => {
			setIsChangingItemsPerPage(false);
		}, 500);
	}, []);

	const handlePageChange = useCallback(
		(newPage) => {
			if (newPage >= 1 && newPage <= totalPages && !isChangingItemsPerPage) {
				setCurrentPage(newPage);
			}
		},
		[totalPages, isChangingItemsPerPage]
	);

	// Filter handlers
	const handleFilterChange = useCallback({
		apply: (filterType, filterValue) => {
			const newFilters = {
				...activeFilters,
				[filterType]: filterValue
			};
			setActiveFilters(newFilters);
			setCurrentPage(1); // Reset to first page when applying filters
		},
		clear: () => {
			setActiveFilters({});
			setCurrentPage(1); // Reset to first page when clearing filters
		},
		getSuggestions: async (type, query) => {
			if (getSuggestionsFunction.current) {
				return await getSuggestionsFunction.current(type, query);
			}
			return [];
		}
	}, [activeFilters]);

	// Calculate index for display
	const startIndex =
		totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
	const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

	return (
		<>
			<div className="container my-16 flex-col justify-between space-y-8 rounded-2xl bg-[#1E2939] px-9 pb-6 pt-9">
				<div className="items-ends flex flex-row justify-between">
					<div>
						<LeftUtils
							onAddClick={openModal}
							onRefresh={handleRefresh}
							isRefreshing={isRefreshing || isChangingItemsPerPage}
							itemsPerPage={itemsPerPage}
							onItemsPerPageChange={handleItemsPerPageChange}
							onFilterChange={handleFilterChange}
							currentFilters={activeFilters}
						/>
					</div>
					<div className="text-5xl font-semibold text-[#99a1af]">
						Daftar Buku
					</div>
				</div>
				<div className="flex w-full flex-col items-center justify-center">
					<div className="relative w-full">
						{isChangingItemsPerPage && (
							<div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-[#1E2939] bg-opacity-75">
								<div className="flex items-center gap-3 text-[#99A1AF]">
									<div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#99A1AF] border-t-transparent"></div>
									<span>Memuat {itemsPerPage} items...</span>
								</div>
							</div>
						)}

						<Table
							onRefresh={setRefreshFunction}
							isRefreshing={isRefreshing}
							itemsPerPage={itemsPerPage}
							currentPage={currentPage}
							onPageChange={handlePageChange}
							onTotalPagesChange={setTotalPages}
							onTotalItemsChange={setTotalItems}
							onViewBook={openViewModal}
							onEditBook={openEditModal}
							filters={activeFilters}
							onGetSuggestions={setGetSuggestionsFunction}
						/>
					</div>
				</div>
				<div className="flex justify-center">
					<NavigateUtils
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
						totalItems={totalItems}
						itemsPerPage={itemsPerPage}
						startIndex={startIndex}
						endIndex={endIndex}
						disabled={isChangingItemsPerPage}
					/>
				</div>
			</div>

			{/* Add Book Modal - ensure proper positioning */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] p-4 backdrop-blur-sm">
					<div className="relative w-full max-w-lg">
						<CompleteBookForm
							onClose={closeModal}
							onBookAdded={handleRefresh}
						/>
					</div>
				</div>
			)}

			{/* View Book Modal */}
			{isViewModalOpen && selecteditemId && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] p-4 backdrop-blur-sm">
					<div className="relative w-full max-w-2xl">
						<BookDetail itemId={selecteditemId} onClose={closeViewModal} />
					</div>
				</div>
			)}

			{/* Edit Book Modal */}
			{isEditModalOpen && selectedBookData && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] p-4 backdrop-blur-sm">
					<div className="relative w-full max-w-lg">
						<CompleteBookForm
							onClose={closeEditModal}
							onBookAdded={handleRefresh}
							bookToEdit={selectedBookData}
						/>
					</div>
				</div>
			)}
		</>
	);
}