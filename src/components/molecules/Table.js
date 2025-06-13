'use client';
import React, { useState, useEffect } from 'react';
import RowUtils from '../molecules/RowUtils';
import { supabase } from '@/lib/supabase';

export default function Table({
	onRefresh,
	itemsPerPage = 25,
	currentPage = 1,
	onPageChange,
	onTotalPagesChange,
	onTotalItemsChange,
	onViewBook,
	onEditBook,
	filters = {}, // New prop for filters
	onGetSuggestions, // New prop for getting suggestions
}) {
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [totalBooks, setTotalBooks] = useState(0);

	// Function to get suggestions for autocomplete
	const getSuggestions = async (type, query) => {
		try {
			let suggestions = [];

			switch (type) {
				case 'penulis':
					// Using the view to get unique authors
					const { data: penulisData, error: penulisError } = await supabase
						.from('buku_detail_view')
						.select('penulis')
						.not('penulis', 'is', null);

					if (penulisError) throw penulisError;

					// Extract unique authors and filter by query
					const allAuthors =
						penulisData?.flatMap((book) => book.penulis || []) || [];
					const uniqueAuthors = [...new Set(allAuthors)]
						.filter((author) =>
							author.toLowerCase().includes(query.toLowerCase())
						)
						.slice(0, 10);

					suggestions = uniqueAuthors;
					break;

				case 'penerbit':
					const { data: penerbitData, error: penerbitError } = await supabase
						.from('buku_detail_view')
						.select('nama_penerbit')
						.ilike('nama_penerbit', `%${query}%`)
						.limit(10);

					if (penerbitError) throw penerbitError;
					suggestions = [
						...new Set(penerbitData?.map((p) => p.nama_penerbit) || []),
					];
					break;

				case 'tahun':
					// Get distinct years from view
					const { data: tahunData, error: tahunError } = await supabase
						.from('buku_detail_view')
						.select('tahun')
						.not('tahun', 'is', null)
						.order('tahun', { ascending: false });

					if (tahunError) throw tahunError;

					// Filter years by query and remove duplicates
					const years = [
						...new Set(tahunData?.map((book) => book.tahun.toString()) || []),
					]
						.filter((year) => year.includes(query))
						.slice(0, 10);

					suggestions = years;
					break;

				default:
					suggestions = [];
			}

			return suggestions;
		} catch (error) {
			console.error('Error getting suggestions:', error);
			return [];
		}
	};

	// Expose getSuggestions function to parent
	useEffect(() => {
		if (onGetSuggestions) {
			onGetSuggestions(getSuggestions);
		}
	}, [onGetSuggestions]);

	// Build query with filters using the view
	const buildQuery = (page = currentPage, limit = itemsPerPage) => {
		const offset = (page - 1) * limit;

		let query = supabase
			.from('buku_detail_view')
			.select('*', { count: 'exact' });

		// Apply filters
		if (filters.penerbit) {
			query = query.eq('nama_penerbit', filters.penerbit);
		}

		if (filters.tahun) {
			query = query.eq('tahun', parseInt(filters.tahun));
		}

		if (filters.penulis) {
			// For author filter, we need to check if the author exists in the array
			query = query.contains('penulis', [filters.penulis]);
		}

		return query
			.range(offset, offset + limit - 1)
			.order('buku_id', { ascending: true });
	};

	// Fungsi untuk mengambil data dari view dengan filter
	const fetchBooks = async (page = currentPage, limit = itemsPerPage) => {
		try {
			setLoading(true);

			console.log('Applied filters:', filters);

			// Use the view query
			const { data, error, count: totalCount } = await buildQuery(page, limit);

			if (error) throw error;

			console.log('Raw data from view:', data);

			// Transform data to match the original structure
			const transformedData = (data || []).map((book) => {
				return {
					id: book.buku_id,
					judul: book.judul,
					genre: book.genre,
					tahun_terbit: book.tahun_terbit,
					jumlah_halaman: book.jumlah_halaman,
					deskripsi: book.deskripsi,
					penerbit_id: book.penerbit_id,
					penerbit: book.nama_penerbit,
					penulis: book.penulis?.map((nama) => ({ nama_penulis: nama })) || [],
				};
			});

			console.log('Transformed data:', transformedData);

			setBooks(transformedData);
			setTotalBooks(totalCount || 0);

			// Update parent component
			if (onTotalItemsChange) {
				onTotalItemsChange(totalCount || 0);
			}

			const totalPages = Math.ceil((totalCount || 0) / limit);
			if (onTotalPagesChange) {
				onTotalPagesChange(totalPages);
			}

			setLoading(false);
		} catch (err) {
			console.error('Error fetching books:', err);
			setError(err.message);
			setLoading(false);
		}
	};

	// Fetch data when filters, page, or itemsPerPage change
	useEffect(() => {
		fetchBooks(currentPage, itemsPerPage);
	}, [currentPage, itemsPerPage, filters]);

	// Expose fetchBooks function through onRefresh callback
	useEffect(() => {
		if (onRefresh) {
			onRefresh(() => fetchBooks(currentPage, itemsPerPage));
		}
	}, [onRefresh, currentPage, itemsPerPage, filters]);

	// Handler untuk aksi pada baris
	const handleView = (itemId) => {
		console.log('View book:', itemId);
		if (onViewBook) {
			onViewBook(itemId);
		}
	};

	const handleEdit = (itemId) => {
		console.log('Edit book:', itemId);
		const bookToEdit = books.find((book) => book.id === itemId);
		if (bookToEdit && onEditBook) {
			onEditBook(bookToEdit);
		}
	};

	const handleDelete = async (itemId) => {
		if (window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
			try {
				// Delete dari tabel asli (bukan view)
				const { error } = await supabase.from('Buku').delete().eq('id', itemId);

				if (error) throw error;

				// Refresh data setelah delete
				fetchBooks(currentPage, itemsPerPage);
				alert('Buku berhasil dihapus!');
			} catch (err) {
				alert('Gagal menghapus buku: ' + err.message);
			}
		}
	};

	// Format tahun dari tanggal
	const formatYear = (dateString) => {
		if (!dateString) return 'Tidak ada tahun';
		try {
			return new Date(dateString).getFullYear();
		} catch (error) {
			return 'Invalid date';
		}
	};

	// Format nama penulis
	const formatAuthors = (authors) => {
		if (!authors || !Array.isArray(authors) || authors.length === 0) {
			return 'Tidak ada penulis';
		}
		return authors
			.map((author) => author?.nama_penulis || 'Unknown')
			.join(', ');
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
					onClick={() => fetchBooks(currentPage, itemsPerPage)}
					className="mt-2 rounded bg-[#FB64B6] px-4 py-2 text-white transition-colors duration-300 hover:bg-[#FF008A]"
				>
					Coba Lagi
				</button>
			</div>
		);
	}

	return (
		<div className="w-full">
			{/* Filter indicator */}
			{Object.keys(filters).length > 0 && (
				<div className="mb-2 flex flex-wrap gap-2">
					{Object.entries(filters).map(([key, value]) => (
						<span
							key={key}
							className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-gray-400"
						>
							{value}
						</span>
					))}
				</div>
			)}

			<table className="w-full overflow-hidden rounded-md text-black shadow-lg">
				<thead className="bg-[#00BCFF] font-semibold text-white">
					<tr>
						<th className="px-4 py-3 text-left">JUDUL</th>
						<th className="px-4 py-3 text-left">GENRE</th>
						<th className="px-4 py-3 text-left">PENULIS</th>
						<th className="px-4 py-3 text-left">PENERBIT</th>
						<th className="px-4 py-3 text-left">TAHUN</th>
						<th className="px-4 py-3 text-left">AKSI</th>
					</tr>
				</thead>
				<tbody className="bg-[#0f172a] text-[#ffffff]">
					{books.length === 0 ? (
						<tr>
							<td colSpan="6" className="px-4 py-8 text-center text-gray-400">
								{Object.keys(filters).length > 0
									? 'Tidak ada data buku yang sesuai dengan filter'
									: 'Tidak ada data buku'}
							</td>
						</tr>
					) : (
						books.map((book, index) => (
							<tr key={book.id} className="border-t-2 border-[#334155]">
								<td className="px-4 py-3 font-medium">{book.judul}</td>
								<td className="px-4 py-3">{book.genre}</td>
								<td className="px-4 py-3">{formatAuthors(book.penulis)}</td>
								<td className="px-4 py-3">{book.penerbit}</td>
								<td className="px-4 py-3">{formatYear(book.tahun_terbit)}</td>
								<td className="w-1.5 px-4 py-3">
									<RowUtils
										itemId={book.id}
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
