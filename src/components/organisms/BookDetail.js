'use client';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function BookDetail({ itemId, onClose }) {
	const [book, setBook] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchBookDetail() {
			try {
				setLoading(true);
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
			Penerbit (
			  nama_penerbit
			),
			Buku_Penulis (
			  Penulis (
				nama_penulis
			  )
			)
		  `
					)
					.eq('id', itemId)
					.single();

				if (error) throw error;

				// Transform data to include author names
				const transformedBook = {
					...data,
					penerbit: data.Penerbit?.nama_penerbit || 'Tidak ada penerbit',
					penulis:
						data.Buku_Penulis?.map((bp) => bp.Penulis?.nama_penulis).filter(
							Boolean
						) || [],
				};

				setBook(transformedBook);
			} catch (err) {
				console.error('Error fetching book details:', err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}

		if (itemId) {
			fetchBookDetail();
		}
	}, [itemId]);

	// Format date to year
	const formatYear = (dateString) => {
		if (!dateString) return 'Tidak ada tahun';
		try {
			return new Date(dateString).getFullYear();
		} catch (error) {
			return 'Invalid date';
		}
	};

	return (
		<div className="w-full max-w-2xl overflow-hidden rounded-lg bg-slate-800 shadow-2xl">
			{/* Header */}
			<div className="flex items-center justify-between bg-[#00BCFF] px-6 py-4">
				<h2 className="text-2xl font-bold text-white">DETAIL BUKU</h2>
				<button
					type="button"
					onClick={onClose}
					className="text-2xl font-bold text-white transition-colors hover:scale-110 hover:cursor-pointer"
				>
					<X size={25} strokeWidth={4} />
				</button>
			</div>

			{/* Content */}
			<div className="p-6 text-white">
				{loading ? (
					<div className="flex justify-center py-8">
						<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-r-2 border-[#00BCFF]"></div>
					</div>
				) : error ? (
					<div className="rounded bg-red-600 px-4 py-3 text-white">
						Error: {error}
					</div>
				) : book ? (
					<div className="space-y-4">
						<h1 className="text-3xl font-bold text-[#00BCFF]">{book.judul}</h1>

						<div className="flex flex-wrap gap-4">
							<div className="rounded bg-slate-700 px-3 py-1">
								<span className="text-gray-400">Genre:</span> {book.genre}
							</div>
							<div className="rounded bg-slate-700 px-3 py-1">
								<span className="text-gray-400">Tahun:</span>{' '}
								{formatYear(book.tahun_terbit)}
							</div>
							<div className="rounded bg-slate-700 px-3 py-1">
								<span className="text-gray-400">Halaman:</span>{' '}
								{book.jumlah_halaman}
							</div>
						</div>

						<div>
							<h3 className="mb-2 text-lg font-semibold text-gray-300">
								Penulis
							</h3>
							{book.penulis.length > 0 ? (
								<ul className="list-inside list-none space-y-2">
									{book.penulis.map((author, index) => (
										<li key={index} className="rounded bg-slate-700 px-3 py-1">
											{author}
										</li>
									))}
								</ul>
							) : (
								<p className="text-gray-400">Tidak ada penulis</p>
							)}
						</div>

						<div>
							<h3 className="mb-2 text-lg font-semibold text-gray-300">
								Penerbit
							</h3>
							<p className="rounded bg-slate-700 px-3 py-1">{book.penerbit}</p>
						</div>

						<div>
							<h3 className="mb-2 text-lg font-semibold text-gray-300">
								Deskripsi
							</h3>
							{book.deskripsi ? (
								<p className="whitespace-pre-line rounded bg-slate-700 p-4">
									{book.deskripsi}
								</p>
							) : (
								<p className="text-gray-400">Tidak ada deskripsi</p>
							)}
						</div>
					</div>
				) : (
					<p className="text-center">Buku tidak ditemukan</p>
				)}
			</div>
		</div>
	);
}
