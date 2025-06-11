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
					const { data: penulisData, error: penulisError } = await supabase
						.from('Penulis')
						.select('nama_penulis')
						.ilike('nama_penulis', `%${query}%`)
						.limit(10);
					
					if (penulisError) throw penulisError;
					suggestions = penulisData?.map(p => p.nama_penulis) || [];
					break;

				case 'penerbit':
					const { data: penerbitData, error: penerbitError } = await supabase
						.from('Penerbit')
						.select('nama_penerbit')
						.ilike('nama_penerbit', `%${query}%`)
						.limit(10);
					
					if (penerbitError) throw penerbitError;
					suggestions = penerbitData?.map(p => p.nama_penerbit) || [];
					break;

				case 'tahun':
					// For year, we'll get distinct years from books
					const { data: tahunData, error: tahunError } = await supabase
						.from('Buku')
						.select('tahun_terbit')
						.not('tahun_terbit', 'is', null)
						.limit(100);
					
					if (tahunError) throw tahunError;
					
					// Extract years and filter by query
					const years = tahunData
						?.map(book => {
							if (book.tahun_terbit) {
								return new Date(book.tahun_terbit).getFullYear().toString();
							}
							return null;
						})
						.filter(year => year && year.includes(query))
						.filter((year, index, self) => self.indexOf(year) === index) // Remove duplicates
						.sort((a, b) => b - a) // Sort descending
						.slice(0, 10);
					
					suggestions = years || [];
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

	// Build query with filters
	const buildQuery = (page = currentPage, limit = itemsPerPage) => {
		const offset = (page - 1) * limit;

		let query = supabase
			.from('Buku')
			.select(
				`
				id,
				judul,
				genre,
				tahun_terbit,
				jumlah_halaman,
				deskripsi,
				penerbit_id,
				Penerbit!inner (
					id,
					nama_penerbit
				),
				Buku_Penulis (
					Penulis (
						nama_penulis
					)
				)
				`,
				{ count: 'exact' }
			);

		// Apply filters
		if (filters.penerbit) {
			query = query.eq('Penerbit.nama_penerbit', filters.penerbit);
		}

		if (filters.tahun) {
			// Filter by year - need to extract year from date
			const startDate = `${filters.tahun}-01-01`;
			const endDate = `${filters.tahun}-12-31`;
			query = query.gte('tahun_terbit', startDate).lte('tahun_terbit', endDate);
		}

		// For author filter, we need a different approach since it's in a related table
		return query.range(offset, offset + limit - 1).order('id', { ascending: true });
	};

	// Fungsi untuk mengambil data dari Supabase dengan filter
	const fetchBooks = async (page = currentPage, limit = itemsPerPage) => {
		try {
			setLoading(true);

			let books = [];
			let count = 0;

			// If filtering by author, we need a special query
			if (filters.penulis) {
				// First, get book IDs that have the specified author
				const { data: bookPenulisData, error: bookPenulisError } = await supabase
					.from('Buku_Penulis')
					.select(`
						buku_id,
						Penulis!inner (
							nama_penulis
						)
					`)
					.eq('Penulis.nama_penulis', filters.penulis);

				if (bookPenulisError) throw bookPenulisError;

				const bookIds = bookPenulisData?.map(bp => bp.buku_id) || [];

				if (bookIds.length === 0) {
					// No books found for this author
					setBooks([]);
					setTotalBooks(0);
					if (onTotalItemsChange) onTotalItemsChange(0);
					if (onTotalPagesChange) onTotalPagesChange(0);
					setLoading(false);
					return;
				}

				// Now get the books with other filters applied
				const offset = (page - 1) * limit;
				
				let bookQuery = supabase
					.from('Buku')
					.select(
						`
						id,
						judul,
						genre,
						tahun_terbit,
						jumlah_halaman,
						deskripsi,
						penerbit_id,
						Penerbit!inner (
							id,
							nama_penerbit
						),
						Buku_Penulis (
							Penulis (
								nama_penulis
							)
						)
						`,
						{ count: 'exact' }
					)
					.in('id', bookIds);

				// Apply other filters
				if (filters.penerbit) {
					bookQuery = bookQuery.eq('Penerbit.nama_penerbit', filters.penerbit);
				}

				if (filters.tahun) {
					const startDate = `${filters.tahun}-01-01`;
					const endDate = `${filters.tahun}-12-31`;
					bookQuery = bookQuery.gte('tahun_terbit', startDate).lte('tahun_terbit', endDate);
				}

				const { data, error, count: totalCount } = await bookQuery
					.range(offset, offset + limit - 1)
					.order('id', { ascending: true });

				if (error) throw error;
				books = data || [];
				count = totalCount || 0;

			} else {
				// No author filter, use regular query
				const { data, error, count: totalCount } = await buildQuery(page, limit);

				if (error) throw error;
				books = data || [];
				count = totalCount || 0;
			}

			console.log('Raw data from Supabase:', books);
			console.log('Applied filters:', filters);

			// Transform data
			const transformedData = books.map((book) => {
				return {
					...book,
					penerbit: book.Penerbit?.nama_penerbit || 'Tidak ada penerbit',
					penulis: book.Buku_Penulis?.map((bp) => bp.Penulis) || [],
				};
			});

			console.log('Transformed data:', transformedData);

			setBooks(transformedData);
			setTotalBooks(count);

			// Update parent component
			if (onTotalItemsChange) {
				onTotalItemsChange(count);
			}

			const totalPages = Math.ceil(count / limit);
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
				// Delete dari Supabase
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
						className="bg-slate-700 text-gray-400 text-xs px-2 py-0.5 rounded-full"
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
									: 'Tidak ada data buku'
								}
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