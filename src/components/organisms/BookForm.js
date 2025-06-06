'use client';
import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { yearOptions, genreOptions } from '@/lib/options';
import AuthorField from '../molecules/AuthorField';
import { supabase } from '@/lib/supabase'; // Sesuaikan dengan path supabase client Anda

export default function CompleteBookForm({
	onClose,
	onBookAdded,
	bookToEdit = null,
}) {
	const [formData, setFormData] = useState({
		title: '',
		genre: '',
		year: '',
		pages: '',
		publisher: '',
		description: '',
	});

	const [authors, setAuthors] = useState(['']);
	const [existingAuthors, setExistingAuthors] = useState([]);
	const [existingPublishers, setExistingPublishers] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	// Fetch existing authors and publishers from Supabase
	useEffect(() => {
		fetchExistingData();
	}, []);

	const fetchExistingData = async () => {
		try {
			// Fetch authors
			const { data: authorsData, error: authorsError } = await supabase
				.from('Penulis')
				.select('nama_penulis')
				.order('nama_penulis');

			if (authorsError) throw authorsError;

			// Fetch publishers
			const { data: publishersData, error: publishersError } = await supabase
				.from('Penerbit')
				.select('nama_penerbit')
				.order('nama_penerbit');

			if (publishersError) throw publishersError;

			setExistingAuthors(authorsData.map((author) => author.nama_penulis));
			setExistingPublishers(
				publishersData.map((publisher) => publisher.nama_penerbit)
			);
		} catch (error) {
			console.error('Error fetching existing data:', error);
			setError('Gagal memuat data penulis dan penerbit');
		}
	};

	// Function to convert year to date (January 1st of that year)
	const convertYearToDate = (year) => {
		if (!year) return null;
		// Create date string in YYYY-MM-DD format for January 1st
		return `${year}-01-01`;
	};

	// Function to get or create publisher
	const getOrCreatePublisher = async (publisherName) => {
		try {
			// Check if publisher exists
			const { data: existingPublisher, error: fetchError } = await supabase
				.from('Penerbit')
				.select('id')
				.eq('nama_penerbit', publisherName)
				.single();

			if (fetchError && fetchError.code !== 'PGRST116') {
				throw fetchError;
			}

			if (existingPublisher) {
				return existingPublisher.id;
			}

			// Create new publisher
			const { data: newPublisher, error: createError } = await supabase
				.from('Penerbit')
				.insert([{ nama_penerbit: publisherName }])
				.select('id')
				.single();

			if (createError) throw createError;

			return newPublisher.id;
		} catch (error) {
			console.error('Error with publisher:', error);
			throw error;
		}
	};

	// Function to get or create authors
	const getOrCreateAuthors = async (authorNames) => {
		try {
			const authorIds = [];

			for (const authorName of authorNames) {
				// Check if author exists
				const { data: existingAuthor, error: fetchError } = await supabase
					.from('Penulis')
					.select('id')
					.eq('nama_penulis', authorName)
					.single();

				if (fetchError && fetchError.code !== 'PGRST116') {
					throw fetchError;
				}

				if (existingAuthor) {
					authorIds.push(existingAuthor.id);
				} else {
					// Create new author
					const { data: newAuthor, error: createError } = await supabase
						.from('Penulis')
						.insert([{ nama_penulis: authorName }])
						.select('id')
						.single();

					if (createError) throw createError;
					authorIds.push(newAuthor.id);
				}
			}

			return authorIds;
		} catch (error) {
			console.error('Error with authors:', error);
			throw error;
		}
	};

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	// Add this effect to populate form with book data when editing
	useEffect(() => {
		if (bookToEdit) {
			setFormData({
				title: bookToEdit.judul || '',
				genre: bookToEdit.genre || '',
				year: bookToEdit.tahun_terbit
					? new Date(bookToEdit.tahun_terbit).getFullYear().toString()
					: '',
				pages: bookToEdit.jumlah_halaman?.toString() || '',
				publisher: bookToEdit.penerbit || '',
				description: bookToEdit.deskripsi || '',
			});

			// Set authors if available
			if (bookToEdit.penulis && Array.isArray(bookToEdit.penulis)) {
				setAuthors(
					bookToEdit.penulis.map((author) =>
						typeof author === 'string' ? author : author.nama_penulis || ''
					)
				);
			}
		}
	}, [bookToEdit]);

	const handleSubmit = async () => {
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

		setIsLoading(true);
		setError('');

		try {
			const filteredAuthors = authors.filter((a) => a.trim() !== '');
			const publisherId = await getOrCreatePublisher(formData.publisher);
			const authorIds = await getOrCreateAuthors(filteredAuthors);
			const publishDate = convertYearToDate(formData.year);

			if (bookToEdit) {
				// UPDATE EXISTING BOOK
				const { error: bookError } = await supabase
					.from('Buku')
					.update({
						judul: formData.title,
						genre: formData.genre,
						tahun_terbit: publishDate,
						jumlah_halaman: parseInt(formData.pages),
						deskripsi: formData.description || null,
						penerbit_id: publisherId,
					})
					.eq('id', bookToEdit.id);

				if (bookError) throw bookError;

				// Delete existing author relationships
				const { error: deleteError } = await supabase
					.from('Buku_Penulis')
					.delete()
					.eq('buku_id', bookToEdit.id);

				if (deleteError) throw deleteError;

				// Create new author relationships
				const bookAuthorRelations = authorIds.map((authorId) => ({
					buku_id: bookToEdit.id,
					penulis_id: authorId,
				}));

				const { error: relationError } = await supabase
					.from('Buku_Penulis')
					.insert(bookAuthorRelations);

				if (relationError) throw relationError;

				alert('Buku berhasil diperbarui!');
			} else {
				// CREATE NEW BOOK - your existing code for creating a book
				const { data: bookData, error: bookError } = await supabase
					.from('Buku')
					.insert([
						{
							judul: formData.title,
							genre: formData.genre,
							tahun_terbit: publishDate, // Now sending as date instead of integer
							jumlah_halaman: parseInt(formData.pages),
							deskripsi: formData.description || null,
							penerbit_id: publisherId,
						},
					])
					.select('id')
					.single();

				if (bookError) throw bookError;

				// Create book-author relationships (assuming you have a junction table)
				// Sesuaikan nama tabel dan kolom dengan struktur database Anda
				const bookAuthorRelations = authorIds.map((authorId) => ({
					buku_id: bookData.id,
					penulis_id: authorId,
				}));

				const { error: relationError } = await supabase
					.from('Buku_Penulis') // Sesuaikan nama tabel junction
					.insert(bookAuthorRelations);

				if (relationError) throw relationError;

				alert('Buku berhasil disimpan!');
			}

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

			// Refresh existing data
			await fetchExistingData();

			// Callback to parent component
			if (onBookAdded) {
				onBookAdded();
			}

			// Close modal after successful save
			if (onClose) {
				onClose();
			}
		} catch (error) {
			console.error('Error saving book:', error);
			setError('Gagal menyimpan buku. Silakan coba lagi.');
			alert('Gagal menyimpan buku: ' + error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		if (
			confirm(
				'Apakah Anda yakin ingin menutup form? Data yang belum disimpan akan hilang.'
			)
		) {
			if (onClose) {
				onClose();
			}
		}
	};

	return (
		<div className="w-full max-w-lg overflow-hidden rounded-lg bg-slate-800 shadow-2xl">
			{/* Header */}
			<div className="flex items-center justify-between bg-[#C27AFF] px-6 py-4">
				<h2 className="text-2xl font-bold text-white">
					{bookToEdit ? 'EDIT BUKU' : 'TAMBAH BUKU'}
				</h2>
				<button
					type="button"
					onClick={handleClose}
					className="text-2xl font-bold text-white transition-colors hover:scale-110 hover:cursor-pointer"
				>
					<X size={25} strokeWidth={4} />
				</button>
			</div>

			{/* Error Message */}
			{error && <div className="bg-red-600 px-6 py-2 text-white">{error}</div>}

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
						disabled={isLoading}
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
							disabled={isLoading}
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
							disabled={isLoading}
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
							disabled={isLoading}
						/>
					</div>
				</div>

				<AuthorField
					authors={authors}
					setAuthors={setAuthors}
					existingAuthors={existingAuthors}
					disabled={isLoading}
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
						disabled={isLoading}
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
						disabled={isLoading}
					/>
				</div>

				<button
					onClick={handleSubmit}
					disabled={isLoading}
					className="w-full transform rounded bg-[#C27AFF] p-3 font-bold text-white transition-colors duration-200 hover:scale-105 hover:cursor-pointer hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
				>
					{isLoading ? 'MENYIMPAN...' : 'SIMPAN'}
				</button>
			</div>
		</div>
	);
}
