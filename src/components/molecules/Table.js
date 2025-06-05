'use client';
import React, { useState, useEffect } from 'react';
import RowUtils from '../molecules/RowUtils'; // Pastikan path ini sesuai dengan struktur folder Anda
import { supabase } from '@/lib/supabase'; // Sesuaikan dengan path supabase client Anda

export default function Table({ onRefresh }) {
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fungsi untuk mengambil data dari Supabase
	const fetchBooks = async () => {
		try {
			setLoading(true);

			// Query ke Supabase dengan relasi
			const { data, error } = await supabase.from('Buku').select(`
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
        `);

			if (error) {
				console.error('Supabase error:', error);
				throw error;
			}

			console.log('Raw data from Supabase:', data); // Debug log

			// Transform data untuk menyesuaikan dengan struktur yang diharapkan
			const transformedData =
				data?.map((book) => {
					console.log('Processing book:', book); // Debug log
					return {
						...book,
						penerbit: book.Penerbit?.nama_penerbit || 'Tidak ada penerbit',
						penulis: book.Buku_Penulis?.map((bp) => bp.Penulis) || [],
					};
				}) || [];

			console.log('Transformed data:', transformedData); // Debug log
			setBooks(transformedData);
			setLoading(false);
		} catch (err) {
			console.error('Error fetching books:', err);
			setError(err.message);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBooks();
	}, []);

	// Expose fetchBooks function through onRefresh callback
	useEffect(() => {
		if (onRefresh) {
			onRefresh(fetchBooks);
		}
	}, [onRefresh]);

	// Handler untuk aksi pada baris
	const handleView = (bookId) => {
		console.log('View book:', bookId);
		// TODO: Implementasi modal atau navigasi ke detail
	};

	const handleEdit = (bookId) => {
		console.log('Edit book:', bookId);
		// TODO: Implementasi edit form
	};

	const handleDelete = async (bookId) => {
		if (window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
			try {
				// Delete dari Supabase
				const { error } = await supabase.from('Buku').delete().eq('id', bookId);

				if (error) throw error;

				// Refresh data setelah delete
				fetchBooks();
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
		<div className="max-h-100 w-full overflow-scroll overflow-x-hidden rounded-md shadow-lg">
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
