'use client';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function FormPenerbit({
	onClose,
	onPublisherAdded,
	publisherToEdit = null,
}) {
	const [formData, setFormData] = useState({
		name: '',
		address: '',
		phone: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	// Populate form jika edit
	useEffect(() => {
		if (publisherToEdit) {
			setFormData({
				name: publisherToEdit.nama_penerbit || '',
				address: publisherToEdit.alamat_penerbit || '',
				phone: publisherToEdit.no_telpon || '',
			});
		}
	}, [publisherToEdit]);

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async () => {
		if (!formData.name) {
			alert('Nama penerbit wajib diisi');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			if (publisherToEdit) {
				// Update penerbit
				const { error } = await supabase
					.from('Penerbit')
					.update({
						nama_penerbit: formData.name,
						alamat_penerbit: formData.address || null,
						no_telpon: formData.phone || null,
					})
					.eq('id', publisherToEdit.id);

				if (error) throw error;
				alert('Penerbit berhasil diperbarui!');
			} else {
				// Tambah penerbit baru
				const { error } = await supabase.from('Penerbit').insert([
					{
						nama_penerbit: formData.name,
						alamat_penerbit: formData.address || null,
						no_telpon: formData.phone || null,
					},
				]);

				if (error) throw error;
				alert('Penerbit berhasil ditambahkan!');
			}

			// Reset form
			setFormData({ name: '', address: '', phone: '' });

			// Callback ke parent
			if (onPublisherAdded) onPublisherAdded();

			// Tutup modal
			if (onClose) onClose();
		} catch (error) {
			console.error('Error saving publisher:', error);
			setError('Gagal menyimpan penerbit: ' + error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		if (
			confirm(
				'Apakah Anda yakin ingin menutup form? Perubahan belum disimpan akan hilang.'
			)
		) {
			if (onClose) onClose();
		}
	};

	return (
		<div className="w-full max-w-lg overflow-hidden rounded-lg bg-slate-800 shadow-2xl">
			<div className="flex items-center justify-between bg-[#C27AFF] px-6 py-4">
				<h2 className="text-2xl font-bold text-white">
					{publisherToEdit ? 'EDIT PENERBIT' : 'TAMBAH PENERBIT'}
				</h2>
				<button
					onClick={handleClose}
					className="text-2xl font-bold text-white transition-colors hover:scale-110 hover:cursor-pointer"
				>
					<X size={25} strokeWidth={4} />
				</button>
			</div>

			{error && <div className="bg-red-600 px-6 py-2 text-white">{error}</div>}

			<div className="space-y-4 p-6 text-white">
				<div>
					<label className="mb-2 block text-lg font-semibold text-gray-300">
						Nama Penerbit:
					</label>
					<input
						type="text"
						value={formData.name}
						onChange={(e) => handleInputChange('name', e.target.value)}
						className="w-full rounded border-0 bg-slate-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C27AFF]"
						placeholder="Masukkan nama penerbit"
						disabled={isLoading}
					/>
				</div>

				<div>
					<label className="mb-2 block text-lg font-semibold text-gray-300">
						Alamat Penerbit:
					</label>
					<textarea
						value={formData.address}
						onChange={(e) => handleInputChange('address', e.target.value)}
						className="w-full rounded border-0 bg-slate-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C27AFF]"
						placeholder="Masukkan alamat penerbit"
						rows="3"
						disabled={isLoading}
					/>
				</div>

				<div>
					<label className="mb-2 block text-lg font-semibold text-gray-300">
						No. Telepon:
					</label>
					<input
						type="tel"
						value={formData.phone}
						onChange={(e) => handleInputChange('phone', e.target.value)}
						className="w-full rounded border-0 bg-slate-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C27AFF]"
						placeholder="Masukkan nomor telepon"
						disabled={isLoading}
					/>
				</div>

				<button
					onClick={handleSubmit}
					disabled={isLoading}
					className="w-full rounded bg-[#C27AFF] p-3 font-bold text-white transition hover:scale-105 hover:cursor-pointer hover:bg-purple-600 disabled:opacity-50"
				>
					{isLoading ? 'MENYIMPAN...' : 'SIMPAN'}
				</button>
			</div>
		</div>
	);
}
