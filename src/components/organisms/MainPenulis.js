'use client';
import React, { useState, useRef, useCallback } from 'react';
import LeftUtils from '../molecules/LeftUtils';
import NavigateUtils from '../molecules/NavigateUtils';
import TabelPenulis from '../molecules/TabelPenulis';
import FormPenulis from './FormPenulis';
import DetailPenulis from './DetailPenulis';

export default function MainPenulis() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedAuthorId, setSelectedAuthorId] = useState(null);
	const [selectedAuthorData, setSelectedAuthorData] = useState(null);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const refreshFunction = useRef(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(25);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [isChangingItemsPerPage, setIsChangingItemsPerPage] = useState(false);

	const openModal = useCallback(() => setIsModalOpen(true), []);
	const closeModal = useCallback(() => setIsModalOpen(false), []);

	const openViewModal = useCallback((authorId) => {
		setSelectedAuthorId(authorId);
		setIsViewModalOpen(true);
	}, []);

	const closeViewModal = useCallback(() => {
		setIsViewModalOpen(false);
		setSelectedAuthorId(null);
	}, []);

	const openEditModal = useCallback((authorData) => {
		setSelectedAuthorData(authorData);
		setIsEditModalOpen(true);
	}, []);

	const closeEditModal = useCallback(() => {
		setIsEditModalOpen(false);
		setSelectedAuthorData(null);
	}, []);

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

	const setRefreshFunction = useCallback((fn) => {
		refreshFunction.current = fn;
	}, []);

	const handleItemsPerPageChange = useCallback((newItemsPerPage) => {
		setIsChangingItemsPerPage(true);
		setItemsPerPage(newItemsPerPage);
		setCurrentPage(1);
		setTimeout(() => setIsChangingItemsPerPage(false), 500);
	}, []);

	const handlePageChange = useCallback(
		(newPage) => {
			if (newPage >= 1 && newPage <= totalPages) {
				setCurrentPage(newPage);
			}
		},
		[totalPages]
	);

	// Config untuk Writer Page - tanpa filter
	const writerConfig = {
		showAddButton: true,
		showItemsPerPage: true,
		showFilter: false, // Filter disabled untuk writer
		showRefresh: true,
	};

	const startIndex =
		totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
	const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

	return (
		<>
			<div className="container my-16 flex-col space-y-8 rounded-2xl bg-[#1E2939] px-9 pb-6 pt-9">
				<div className="flex items-end justify-between">
					<LeftUtils
						onAddClick={openModal}
						onRefresh={handleRefresh}
						isRefreshing={isRefreshing || isChangingItemsPerPage}
						itemsPerPage={itemsPerPage}
						onItemsPerPageChange={handleItemsPerPageChange}
						config={writerConfig}
					/>
					<div className="text-5xl font-semibold text-[#99a1af]">
						Daftar Penulis
					</div>
				</div>

				<div className="relative w-full">
					{isChangingItemsPerPage && (
						<div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-[#1E2939] bg-opacity-75">
							<div className="flex items-center gap-3 text-[#99A1AF]">
								<div className="h-6 w-6 animate-spin rounded-full border-2 border-[#99A1AF] border-t-transparent"></div>
								<span>Memuat {itemsPerPage} items...</span>
							</div>
						</div>
					)}

					<TabelPenulis
						onRefresh={setRefreshFunction}
						itemsPerPage={itemsPerPage}
						currentPage={currentPage}
						onPageChange={handlePageChange}
						onTotalPagesChange={setTotalPages}
						onTotalItemsChange={setTotalItems}
						onViewAuthor={openViewModal}
						onEditAuthor={openEditModal}
					/>
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
					/>
				</div>
			</div>

			{/* Modals */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
					<FormPenulis onClose={closeModal} onAuthorAdded={handleRefresh} />
				</div>
			)}

			{isViewModalOpen && selectedAuthorId && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
					<DetailPenulis authorId={selectedAuthorId} onClose={closeViewModal} />
				</div>
			)}

			{isEditModalOpen && selectedAuthorData && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
					<FormPenulis
						onClose={closeEditModal}
						onAuthorAdded={handleRefresh}
						authorToEdit={selectedAuthorData}
					/>
				</div>
			)}
		</>
	);
}
