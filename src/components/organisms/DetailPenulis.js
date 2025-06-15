'use client';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { authorApi } from '@/lib/api';

export default function DetailPenulis({ authorId, onClose }) {
	const [author, setAuthor] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchAuthorDetail() {
			try {
				setLoading(true);
				setError(null);

				const response = await fetch(`/api/authors/${authorId}`);
				const result = await response.json();

				if (result.success) {
					setAuthor(result.data);
				} else {
					throw new Error(result.error || 'Failed to fetch author details');
				}
			} catch (err) {
				console.error('Error fetching author details:', err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}

		if (authorId) {
			fetchAuthorDetail();
		}
	}, [authorId]);

	return (
		<div className="w-full max-w-md overflow-hidden rounded-lg bg-slate-800 shadow-2xl">
			<div className="flex items-center justify-between bg-[#00BCFF] px-6 py-4">
				<h2 className="text-2xl font-bold text-white">DETAIL PENULIS</h2>
				<button
					onClick={onClose}
					className="text-2xl font-bold text-white transition hover:scale-110 hover:cursor-pointer"
				>
					<X size={25} strokeWidth={4} />
				</button>
			</div>

			<div className="p-6 text-white">
				{loading ? (
					<div className="flex justify-center py-8">
						<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-r-2 border-[#00BCFF]"></div>
					</div>
				) : error ? (
					<div className="rounded bg-red-600 px-4 py-3">Error: {error}</div>
				) : author ? (
					<div className="space-y-4">
						<h1 className="text-3xl font-bold text-[#00BCFF]">
							{author.nama_penulis}
						</h1>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<h3 className="mb-2 text-lg font-semibold text-gray-300">ID</h3>
								<p className="rounded bg-slate-700 px-3 py-1">{author.id}</p>
							</div>

							<div>
								<h3 className="mb-2 text-lg font-semibold text-gray-300">
									Email
								</h3>
								<p
									className={
										author.email
											? 'rounded bg-slate-700 px-3 py-1'
											: 'text-gray-400'
									}
								>
									{author.email || 'Tidak ada email'}
								</p>
							</div>
						</div>
					</div>
				) : (
					<p className="text-center">Penulis tidak ditemukan</p>
				)}
			</div>
		</div>
	);
}
