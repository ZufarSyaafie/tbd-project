'use client';
import React, { useState, useEffect } from 'react';
import RowUtils from '../molecules/RowUtils';
import { supabase } from '@/lib/supabase';

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
	const [totalAuthors, setTotalAuthors] = useState(0);

	// Fungsi untuk mengambil data penulis dari Supabase
	const fetchAuthors = async (page = currentPage, limit = itemsPerPage) => {
		try {
			setLoading(true);
			const offset = (page - 1) * limit;

			// Query untuk mendapatkan total count
			const { count, error: countError } = await supabase
				.from('Penulis')
				.select('*', { count: 'exact', head: true });

			if (countError) throw countError;

			// Query untuk mendapatkan data dengan pagination
			const { data, error } = await supabase
				.from('Penulis')
				.select('*')
				.range(offset, offset + limit - 1)
				.order('id', { ascending: true });

			if (error) throw error;

			setAuthors(data || []);
			setTotalAuthors(count || 0);

			// Update parent component
			if (onTotalItemsChange) onTotalItemsChange(count || 0);

			const totalPages = Math.ceil((count || 0) / limit);
			if (onTotalPagesChange) onTotalPagesChange(totalPages);

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
				const { error } = await supabase
					.from('Penulis')
					.delete()
					.eq('id', authorId);

				if (error) throw error;

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
					onClick={fetchAuthors}
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
						{/* <th className="px-4 py-3 text-left">ID</th> */}
						<th className="px-4 py-3 text-left">NAMA PENULIS</th>
						<th className="px-4 py-3 text-left">EMAIL</th>
						<th className="px-4 py-3 text-left">AKSI</th>
					</tr>
				</thead>
				<tbody className="bg-[#0f172a] text-[#ffffff]">
					{authors.length === 0 ? (
						<tr>
							<td colSpan="4" className="px-4 py-8 text-center text-gray-400">
								Tidak ada data penulis
							</td>
						</tr>
					) : (
						authors.map((author) => (
							<tr key={author.id} className="border-t-2 border-[#334155]">
								{/* <td className="px-4 py-3 font-medium">{author.id}</td> */}
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
