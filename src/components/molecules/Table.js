'use client';
import React, { useState, useEffect } from 'react';
import RowUtils from '../molecules/RowUtils'; // Pastikan path ini sesuai dengan struktur folder Anda
import { supabase } from '@/lib/supabase'; // Sesuaikan dengan path supabase client Anda

// Update the component definition to accept new props
export default function Table({
	onRefresh,
	itemsPerPage = 25,
	currentPage = 1,
	onPageChange,
	onTotalPagesChange,
	onTotalItemsChange,
	onViewBook, // New prop for view action
	onEditBook, // New prop for edit action
}) {
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [totalBooks, setTotalBooks] = useState(0);

	// Fungsi untuk mengambil data dari Supabase
	const fetchBooks = async (page = currentPage, limit = itemsPerPage) => {
		try {
			setLoading(true);

			// Hitung offset untuk pagination
			const offset = (page - 1) * limit;

			// Query untuk mendapatkan total count
			const { count, error: countError } = await supabase
				.from('Buku')
				.select('*', { count: 'exact', head: true });

			if (countError) {
				console.error('Count error:', countError);
				throw countError;
			}

			// Query untuk mendapatkan data dengan pagination
			const { data, error } = await supabase
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
        `
				)
				.range(offset, offset + limit - 1)
				.order('id', { ascending: true });

			if (error) {
				console.error('Supabase error:', error);
				throw error;
			}

			console.log('Raw data from Supabase:', data);

			// Transform data untuk menyesuaikan dengan struktur yang diharapkan
			const transformedData =
				data?.map((book) => {
					console.log('Processing book:', book);
					return {
						...book,
						penerbit: book.Penerbit?.nama_penerbit || 'Tidak ada penerbit',
						penulis: book.Buku_Penulis?.map((bp) => bp.Penulis) || [],
					};
				}) || [];

			console.log('Transformed data:', transformedData);

			setBooks(transformedData);
			setTotalBooks(count || 0);

			// Update parent component dengan total items dan pages
			if (onTotalItemsChange) {
				onTotalItemsChange(count || 0);
			}

			const totalPages = Math.ceil((count || 0) / limit);
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

	useEffect(() => {
		fetchBooks(currentPage, itemsPerPage);
	}, [currentPage, itemsPerPage]);

	// Expose fetchBooks function through onRefresh callback
	useEffect(() => {
		if (onRefresh) {
			onRefresh(() => fetchBooks(currentPage, itemsPerPage));
		}
	}, [onRefresh, currentPage, itemsPerPage]);

	// Handler untuk aksi pada baris
	const handleView = (bookId) => {
		console.log('View book:', bookId);
		if (onViewBook) {
			onViewBook(bookId);
		}
	};

	const handleEdit = (bookId) => {
		console.log('Edit book:', bookId);
		// Find the book data to pass to the edit modal
		const bookToEdit = books.find((book) => book.id === bookId);
		if (bookToEdit && onEditBook) {
			onEditBook(bookToEdit);
		}
	};

	const handleDelete = async (bookId) => {
		if (window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
			try {
				// Delete dari Supabase
				const { error } = await supabase.from('Buku').delete().eq('id', bookId);

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

	// Format nama penulis (jika ada multiple penulis)
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
					onClick={fetchBooks}
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
								Tidak ada data buku
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
										bookId={book.id}
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
