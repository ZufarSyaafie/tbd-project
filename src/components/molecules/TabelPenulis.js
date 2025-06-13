'use client';
import React, { useState, useEffect } from 'react';
import RowUtils from '../molecules/RowUtils';

export default function TabelPenulis({
	onRefresh,
	itemsPerPage = 25,
	currentPage = 1,
	onPageChange,
	onTotalPagesChange,
	onTotalItemsChange,
	onViewAuthor,
	onEditAuthor,
}) {
	const [authors, setAuthors] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fungsi untuk mengambil data penulis dari API
	const fetchAuthors = async (page = currentPage, limit = itemsPerPage) => {
		try {
			setLoading(true);

			const response = await fetch(`/api/authors?page=${page}&limit=${limit}`);
			const result = await response.json();

			if (!result.success) {
				throw new Error(result.error);
			}

			setAuthors(result.data);

			// Update parent component
			if (onTotalItemsChange) onTotalItemsChange(result.totalItems);
			if (onTotalPagesChange) onTotalPagesChange(result.totalPages);

			setLoading(false);
		} catch (err) {
			console.error('Error fetching authors:', err);
			setError(err.message);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAuthors(currentPage, itemsPerPage);
	}, [currentPage, itemsPerPage]);

	useEffect(() => {
		if (onRefresh) {
			onRefresh(() => fetchAuthors(currentPage, itemsPerPage));
		}
	}, [onRefresh, currentPage, itemsPerPage]);

	const handleView = (authorId) => {
		if (onViewAuthor) onViewAuthor(authorId);
	};

	const handleEdit = (authorId) => {
		const authorToEdit = authors.find((author) => author.id === authorId);
		if (authorToEdit && onEditAuthor) onEditAuthor(authorToEdit);
	};

	const handleDelete = async (authorId) => {
		if (window.confirm('Apakah Anda yakin ingin menghapus penulis ini?')) {
			try {
				const response = await fetch(`/api/authors/${authorId}`, {
					method: 'DELETE',
				});

				const result = await response.json();

				if (!result.success) {
					throw new Error(result.error);
				}

				fetchAuthors(currentPage, itemsPerPage);
				alert('Penulis berhasil dihapus!');
			} catch (err) {
				alert('Gagal menghapus penulis: ' + err.message);
			}
		}
	};

	if (loading) {
		return (
			<div className="w-full p-8 text-center">
				<div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-r-2 border-[#99A1AF]"></div>
				<p className="mt-2 text-gray-600">Memuat data...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full p-8 text-center">
				<p className="text-[#FB64B6]">ERROR {error}</p>
				<button
					onClick={() => fetchAuthors(currentPage, itemsPerPage)}
					className="mt-2 rounded bg-[#FB64B6] px-4 py-2 text-white transition-colors duration-300 hover:bg-[#FF008A]"
				>
					Coba Lagi
				</button>
			</div>
		);
	}

	return (
		<div className="w-full">
			<table className="w-full overflow-hidden rounded-md text-black shadow-lg">
				<thead className="bg-[#00BCFF] font-semibold text-white">
					<tr>
						<th className="px-4 py-3 text-left">NAMA PENULIS</th>
						<th className="px-4 py-3 text-left">EMAIL</th>
						<th className="px-4 py-3 text-left">AKSI</th>
					</tr>
				</thead>
				<tbody className="bg-[#0f172a] text-[#ffffff]">
					{authors.length === 0 ? (
						<tr>
							<td colSpan="3" className="px-4 py-8 text-center text-gray-400">
								Tidak ada data penulis
							</td>
						</tr>
					) : (
						authors.map((author) => (
							<tr key={author.id} className="border-t-2 border-[#334155]">
								<td className="px-4 py-3">{author.nama_penulis}</td>
								<td className="px-4 py-3">{author.email || '-'}</td>
								<td className="w-1.5 px-4 py-3">
									<RowUtils
										itemId={author.id}
										onView={handleView}
										onEdit={handleEdit}
										onDelete={handleDelete}
									/>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
