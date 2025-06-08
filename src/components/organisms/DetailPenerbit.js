'use client';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DetailPenerbit({ publisherId, onClose }) {
	const [publisher, setPublisher] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchPublisherDetail() {
			try {
				setLoading(true);
				const { data, error } = await supabase
					.from('Penerbit')
					.select('*')
					.eq('id', publisherId)
					.single();

				if (error) throw error;
				setPublisher(data);
			} catch (err) {
				console.error('Error fetching publisher details:', err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}

		if (publisherId) fetchPublisherDetail();
	}, [publisherId]);

	return (
		<div className="w-full max-w-md overflow-hidden rounded-lg bg-slate-800 shadow-2xl">
			<div className="flex items-center justify-between bg-[#00BCFF] px-6 py-4">
				<h2 className="text-2xl font-bold text-white">DETAIL PENERBIT</h2>
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
				) : publisher ? (
					<div className="space-y-4">
						<h1 className="text-3xl font-bold text-[#00BCFF]">
							{publisher.nama_penerbit}
						</h1>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<h3 className="mb-2 text-lg font-semibold text-gray-300">ID</h3>
								<p className="rounded bg-slate-700 px-3 py-1">{publisher.id}</p>
							</div>

							<div>
								<h3 className="mb-2 text-lg font-semibold text-gray-300">
									No. Telepon
								</h3>
								<p className={publisher.no_telpon ? "rounded bg-slate-700 px-3 py-1" : "text-gray-400"}>
									{publisher.no_telpon || 'Tidak ada nomor telepon'}
								</p>
							</div>
						</div>

						<div>
							<h3 className="mb-2 text-lg font-semibold text-gray-300">
								Alamat
							</h3>
							<p className={publisher.alamat_penerbit ? "rounded bg-slate-700 px-3 py-1" : "text-gray-400"}>
								{publisher.alamat_penerbit || 'Tidak ada alamat'}
							</p>
						</div>
					</div>
				) : (
					<p className="text-center">Penerbit tidak ditemukan</p>
				)}
			</div>
		</div>
	);
}
