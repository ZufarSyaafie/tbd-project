'use client';
import React, { useState, useEffect } from 'react';
import RowUtils from './RowUtils';

export default function TabelPenerbit({
	onRefresh,
	itemsPerPage = 25,
	currentPage = 1,
	onPageChange,
	onTotalPagesChange,
	onTotalItemsChange,
	onViewPublisher,
	onEditPublisher,
}) {
	const [publishers, setPublishers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fungsi untuk mengambil data penerbit dari API
	const fetchPublishers = async (page = currentPage, limit = itemsPerPage) => {
		try {
			setLoading(true);

			const response = await fetch(
				`/api/publishers?page=${page}&limit=${limit}`
			);
			const result = await response.json();

			if (!result.success) {
				throw new Error(result.error);
			}

			setPublishers(result.data);

			// Update parent component
			if (onTotalItemsChange) onTotalItemsChange(result.totalItems);
			if (onTotalPagesChange) onTotalPagesChange(result.totalPages);

			setLoading(false);
		} catch (err) {
			console.error('Error fetching publishers:', err);
			setError(err.message);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPublishers(currentPage, itemsPerPage);
	}, [currentPage, itemsPerPage]);

	useEffect(() => {
		if (onRefresh) {
			onRefresh(() => fetchPublishers(currentPage, itemsPerPage));
		}
	}, [onRefresh, currentPage, itemsPerPage]);

	const handleView = (publisherId) => {
		if (onViewPublisher) onViewPublisher(publisherId);
	};

	const handleEdit = (publisherId) => {
		const publisherToEdit = publishers.find(
			(publisher) => publisher.id === publisherId
		);
		if (publisherToEdit && onEditPublisher) onEditPublisher(publisherToEdit);
	};

	const handleDelete = async (publisherId) => {
		if (window.confirm('Apakah Anda yakin ingin menghapus penerbit ini?')) {
			try {
				const response = await fetch(`/api/publishers/${publisherId}`, {
					method: 'DELETE',
				});

				const result = await response.json();

				if (!result.success) {
					throw new Error(result.error);
				}

				fetchPublishers(currentPage, itemsPerPage);
				alert('Penerbit berhasil dihapus!');
			} catch (err) {
				alert('Gagal menghapus penerbit: ' + err.message);
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
					onClick={() => fetchPublishers(currentPage, itemsPerPage)}
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
						<th className="px-4 py-3 text-left">NAMA PENERBIT</th>
						<th className="px-4 py-3 text-left">ALAMAT</th>
						<th className="px-4 py-3 text-left">NO TELEPON</th>
						<th className="px-4 py-3 text-left">AKSI</th>
					</tr>
				</thead>
				<tbody className="bg-[#0f172a] text-[#ffffff]">
					{publishers.length === 0 ? (
						<tr>
							<td colSpan="4" className="px-4 py-8 text-center text-gray-400">
								Tidak ada data penerbit
							</td>
						</tr>
					) : (
						publishers.map((publisher) => (
							<tr key={publisher.id} className="border-t-2 border-[#334155]">
								<td className="px-4 py-3">{publisher.nama_penerbit}</td>
								<td className="w-4xl px-4 py-3">
									{publisher.alamat_penerbit || '-'}
								</td>
								<td className="px-4 py-3">{publisher.no_telpon || '-'}</td>
								<td className="w-1.5 px-4 py-3">
									<RowUtils
										itemId={publisher.id}
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
