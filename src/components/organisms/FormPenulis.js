'use client';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function FormPenulis({
	onClose,
	onAuthorAdded,
	authorToEdit = null,
}) {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	// Populate form jika edit
	useEffect(() => {
		if (authorToEdit) {
			setFormData({
				name: authorToEdit.nama_penulis || '',
				email: authorToEdit.email || '',
			});
		}
	}, [authorToEdit]);

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async () => {
		if (!formData.name) {
			alert('Nama penulis wajib diisi');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			if (authorToEdit) {
				// Update penulis
				const { error } = await supabase
					.from('Penulis')
					.update({
						nama_penulis: formData.name,
						email: formData.email || null,
					})
					.eq('id', authorToEdit.id);

				if (error) throw error;
				alert('Penulis berhasil diperbarui!');
			} else {
				// Tambah penulis baru
				const { error } = await supabase.from('Penulis').insert([
					{
						nama_penulis: formData.name,
						email: formData.email || null,
					},
				]);

				if (error) throw error;
				alert('Penulis berhasil ditambahkan!');
			}

			// Reset form
			setFormData({ name: '', email: '' });

			// Callback ke parent
			if (onAuthorAdded) onAuthorAdded();

			// Tutup modal
			if (onClose) onClose();
		} catch (error) {
			console.error('Error saving author:', error);
			setError('Gagal menyimpan penulis: ' + error.message);
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
					{authorToEdit ? 'EDIT PENULIS' : 'TAMBAH PENULIS'}
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
						Nama Penulis:
					</label>
					<input
						type="text"
						value={formData.name}
						onChange={(e) => handleInputChange('name', e.target.value)}
						className="w-full rounded border-0 bg-slate-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C27AFF]"
						placeholder="Masukkan nama penulis"
						disabled={isLoading}
					/>
				</div>

				<div>
					<label className="mb-2 block text-lg font-semibold text-gray-300">
						Email:
					</label>
					<input
						type="email"
						value={formData.email}
						onChange={(e) => handleInputChange('email', e.target.value)}
						className="w-full rounded border-0 bg-slate-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C27AFF]"
						placeholder="Masukkan email penulis"
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
