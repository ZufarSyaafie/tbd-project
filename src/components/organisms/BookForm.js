'use client';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { yearOptions, genreOptions } from '@/lib/options';
import AuthorField from '../molecules/AuthorField';

export default function CompleteBookForm() {
	const [formData, setFormData] = useState({
		title: '',
		genre: '',
		year: '',
		pages: '',
		publisher: '',
		description: '',
	});

	const [authors, setAuthors] = useState(['']);
	const [existingAuthors] = useState([
		'Ahmad Tohari',
		'Pramoedya Ananta Toer',
		'Andrea Hirata',
		'Tere Liye',
		'Dee Lestari',
	]);
	const [existingPublishers] = useState([
		'Gramedia Pustaka Utama',
		'Mizan',
		'Bentang Pustaka',
		'Republika',
		'Erlangga',
	]);

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = () => {
		if (
			!formData.title ||
			!formData.genre ||
			!formData.year ||
			!formData.pages ||
			!formData.publisher ||
			!authors[0]
		) {
			alert('Semua field wajib diisi dan minimal satu penulis harus ada.');
			return;
		}

		const data = {
			...formData,
			authors: authors.filter((a) => a.trim() !== ''),
		};

		console.log('Data buku:', data);
		alert('Buku berhasil disimpan!');

		// Reset form
		setFormData({
			title: '',
			genre: '',
			year: '',
			pages: '',
			publisher: '',
			description: '',
		});
		setAuthors(['']);
	};

	const handleClose = () => {
		if (
			confirm(
				'Apakah Anda yakin ingin menutup form? Data yang belum disimpan akan hilang.'
			)
		) {
			console.log('Form ditutup');
		}
	};

	return (
		<div className="w-full max-w-lg overflow-hidden rounded-lg bg-slate-800 shadow-2xl">
			{/* Header */}
			<div className="flex items-center justify-between bg-[#C27AFF] px-6 py-4">
				<h2 className="text-2xl font-bold text-white">TAMBAH BUKU</h2>
				<button
					type="button"
					onClick={handleClose}
					className="text-2xl font-bold text-white transition-colors hover:text-gray-200"
				>
					<X size={25} strokeWidth={4} />
				</button>
			</div>

			{/* Form */}
			<div className="space-y-4 p-6 text-white">
				<div>
					<label className="mb-2 block text-lg font-semibold text-gray-300">
						Judul:
					</label>
					<input
						type="text"
						value={formData.title}
						onChange={(e) => handleInputChange('title', e.target.value)}
						className="w-full rounded border-0 bg-slate-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C27AFF]"
						placeholder="Masukkan judul buku"
					/>
				</div>

				<div className="grid grid-cols-3 gap-4">
					<div>
						<label className="mb-2 block text-lg font-semibold text-gray-300">
							Genre:
						</label>
						<select
							value={formData.genre}
							onChange={(e) => handleInputChange('genre', e.target.value)}
							className="w-full rounded border-0 bg-slate-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C27AFF]"
						>
							<option value="">Pilih Genre</option>
							{genreOptions.map((g) => (
								<option key={g} value={g}>
									{g}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="mb-2 block text-lg font-semibold text-gray-300">
							Tahun:
						</label>
						<select
							value={formData.year}
							onChange={(e) => handleInputChange('year', e.target.value)}
							className="w-full rounded border-0 bg-slate-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C27AFF]"
						>
							<option value="">Pilih Tahun</option>
							{yearOptions.map((y) => (
								<option key={y} value={y}>
									{y}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="mb-2 block text-lg font-semibold text-gray-300">
							Halaman:
						</label>
						<input
							type="number"
							min="1"
							value={formData.pages}
							onChange={(e) => handleInputChange('pages', e.target.value)}
							className="w-full rounded border-0 bg-slate-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C27AFF]"
							placeholder="Jumlah"
						/>
					</div>
				</div>

				<AuthorField
					authors={authors}
					setAuthors={setAuthors}
					existingAuthors={existingAuthors}
				/>

				<div>
					<label className="mb-2 block text-lg font-semibold text-gray-300">
						Penerbit:
					</label>
					<input
						type="text"
						list="publisher-options"
						value={formData.publisher}
						onChange={(e) => handleInputChange('publisher', e.target.value)}
						className="w-full rounded border-0 bg-slate-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C27AFF]"
						placeholder="Nama penerbit"
					/>
					<datalist id="publisher-options">
						{existingPublishers.map((publisher) => (
							<option key={publisher} value={publisher} />
						))}
					</datalist>
				</div>

				<div>
					<label className="mb-2 block text-lg font-semibold text-gray-300">
						Deskripsi:
					</label>
					<textarea
						value={formData.description}
						onChange={(e) => handleInputChange('description', e.target.value)}
						className="w-full resize-none rounded border-0 bg-slate-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C27AFF]"
						rows={4}
						placeholder="Deskripsi singkat tentang buku..."
					/>
				</div>

				<button
					onClick={handleSubmit}
					className="w-full transform rounded bg-[#C27AFF] p-3 font-bold text-white transition-colors duration-200 hover:scale-105 hover:bg-purple-600"
				>
					SIMPAN
				</button>
			</div>
		</div>
	);
}
