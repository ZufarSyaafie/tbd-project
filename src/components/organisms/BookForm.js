'use client';
import { useState, useEffect } from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import { yearOptions, genreOptions } from '@/lib/options';
import AuthorField from '../molecules/AuthorField';
import { supabase } from '@/lib/supabase';

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

	// New state for validation errors
	const [validationErrors, setValidationErrors] = useState({
		title: '',
		genre: '',
		year: '',
		pages: '',
		publisher: '',
		authors: [],
	});

	// Validation functions
	const validateAuthor = (value) => {
		// Author names can contain letters, spaces, and some special characters used in names
		if (value && !/^[a-zA-Z\s\-'.]+$/.test(value)) {
			return "Nama penulis hanya boleh berisi huruf, spasi, dan tanda (-')";
		}
		return '';
	};

	const validatePublisher = (value) => {
		// Name should only contain letters, spaces, and common punctuation for publisher names
		if (value && !/^[a-zA-Z\s\-'.&()!?]+$/.test(value)) {
			return 'Nama penerbit hanya boleh berisi huruf, spasi, dan tanda baca umum -\'.&(),!?';
		}
		return '';
	};

	const validatePages = (value) => {
		// Hanya angka positif, tanpa huruf, spasi, simbol, atau karakter lain
		if (!/^[0-9]+$/.test(value) || parseInt(value, 10) <= 0) {
			return 'Harus berupa angka bulat positif';
		}
		return '';
	};

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

	// Updated handleInputChange with validation
	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));

		// Validate input based on field type
		let validationError = '';
		switch (field) {
			case 'pages':
				validationError = validatePages(value);
				break;
			case 'publisher':
				validationError = validatePublisher(value);
				break;
			default:
				break;
		}

		// Update validation errors
		setValidationErrors((prev) => ({
			...prev,
			[field]: validationError,
		}));
	};

	// New handler for author input with validation
	const handleAuthorChange = (index, value) => {
		const newAuthors = [...authors];
		newAuthors[index] = value;

		// Validate author name
		const error = validateAuthor(value);

		// Update validation errors for this author
		const newAuthorErrors = [...validationErrors.authors];
		newAuthorErrors[index] = error;

		setAuthors(newAuthors);
		setValidationErrors((prev) => ({
			...prev,
			authors: newAuthorErrors,
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
				const editAuthors = bookToEdit.penulis.map((author) =>
					typeof author === 'string' ? author : author.nama_penulis || ''
				);
				setAuthors(editAuthors);

				// Initialize author validation errors array
				setValidationErrors((prev) => ({
					...prev,
					authors: Array(editAuthors.length).fill(''),
				}));
			}
		} else {
			// Initialize author validation errors array for new form
			setValidationErrors((prev) => ({
				...prev,
				authors: [''],
			}));
		}
	}, [bookToEdit]);

	// Updated submit handler with comprehensive validation
	const handleSubmit = async () => {
		// Validate all fields before submission
		const errors = {
			title: !formData.title ? 'Judul buku wajib diisi' : '',
			genre: !formData.genre ? 'Genre wajib diisi' : '',
			year: !formData.year ? 'Tahun terbit wajib diisi' : '',
			pages: !formData.pages
				? 'Jumlah halaman wajib diisi'
				: validatePages(formData.pages),
			publisher: !formData.publisher
				? 'Penerbit wajib diisi'
				: validatePublisher(formData.publisher),
			authors: [],
		};

		// Filter out empty authors and validate remaining ones
		const filteredAuthors = authors.filter((a) => a.trim() !== '');
		if (filteredAuthors.length === 0) {
			errors.authorGeneral = 'Minimal satu penulis wajib diisi';
		} else {
			errors.authors = filteredAuthors.map(validateAuthor);
		}

		// Check if we have any validation errors
		const hasErrors =
			Object.values(errors).some(
				(err) => typeof err === 'string' && err !== ''
			) ||
			errors.authors.some((err) => err !== '') ||
			errors.authorGeneral;

		if (hasErrors) {
			setValidationErrors(errors);
			alert('Ada kesalahan pada form. Silakan periksa kembali input Anda.');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
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
				// CREATE NEW BOOK
				const { data: bookData, error: bookError } = await supabase
					.from('Buku')
					.insert([
						{
							judul: formData.title,
							genre: formData.genre,
							tahun_terbit: publishDate,
							jumlah_halaman: parseInt(formData.pages),
							deskripsi: formData.description || null,
							penerbit_id: publisherId,
						},
					])
					.select('id')
					.single();

				if (bookError) throw bookError;

				// Create book-author relationships
				const bookAuthorRelations = authorIds.map((authorId) => ({
					buku_id: bookData.id,
					penulis_id: authorId,
				}));

				const { error: relationError } = await supabase
					.from('Buku_Penulis')
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
			setValidationErrors({
				title: '',
				genre: '',
				year: '',
				pages: '',
				publisher: '',
				authors: [''],
			});

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
		<div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-lg bg-slate-800 shadow-2xl">
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

			{/* Scrollable Form Content */}
			<div className="overflow-y-auto p-6 text-white">
				<div className="space-y-3">
					{/* Form fields - make spacing more compact with space-y-3 */}

					<div>
						<label className="mb-1 block text-lg font-semibold text-gray-300">
							Judul: <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							value={formData.title}
							onChange={(e) => handleInputChange('title', e.target.value)}
							className={`w-full rounded border-0 bg-slate-700 p-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
								validationErrors.title
									? 'border-2 border-red-500 focus:ring-red-500'
									: 'focus:ring-[#C27AFF]'
							}`}
							placeholder="Masukkan judul buku"
							disabled={isLoading}
						/>
						{validationErrors.title && (
							<div className="mt-1 flex items-center text-sm text-red-500">
								<AlertCircle size={16} className="mr-1" />
								{validationErrors.title}
							</div>
						)}
					</div>

					{/* Grid layout for compact form fields */}
					<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
						<div>
							<label className="mb-1 block text-lg font-semibold text-gray-300">
								Genre: <span className="text-red-500">*</span>
							</label>
							<select
								value={formData.genre}
								onChange={(e) => handleInputChange('genre', e.target.value)}
								className={`w-full rounded border-0 bg-slate-700 p-2.5 text-white focus:outline-none focus:ring-2 ${
									validationErrors.genre
										? 'border-2 border-red-500 focus:ring-red-500'
										: 'focus:ring-[#C27AFF]'
								}`}
								disabled={isLoading}
							>
								<option value="">Pilih Genre</option>
								{genreOptions.map((g) => (
									<option key={g} value={g}>
										{g}
									</option>
								))}
							</select>
							{validationErrors.genre && (
								<div className="mt-1 flex items-center text-sm text-red-500">
									<AlertCircle size={16} className="mr-1" />
									{validationErrors.genre}
								</div>
							)}
						</div>

						<div>
							<label className="mb-1 block text-lg font-semibold text-gray-300">
								Tahun: <span className="text-red-500">*</span>
							</label>
							<select
								value={formData.year}
								onChange={(e) => handleInputChange('year', e.target.value)}
								className={`w-full rounded border-0 bg-slate-700 p-2.5 text-white focus:outline-none focus:ring-2 ${
									validationErrors.year
										? 'border-2 border-red-500 focus:ring-red-500'
										: 'focus:ring-[#C27AFF]'
								}`}
								disabled={isLoading}
							>
								<option value="">Pilih Tahun</option>
								{yearOptions.map((y) => (
									<option key={y} value={y}>
										{y}
									</option>
								))}
							</select>
							{validationErrors.year && (
								<div className="mt-1 flex items-center text-sm text-red-500">
									<AlertCircle size={16} className="mr-1" />
									{validationErrors.year}
								</div>
							)}
						</div>

						<div>
							<label className="mb-1 block text-lg font-semibold text-gray-300">
								Halaman: <span className="text-red-500">*</span>
							</label>
							<input
								type="number"
								min="1"
								value={formData.pages}
								onChange={(e) => handleInputChange('pages', e.target.value)}
								className={`w-full rounded border-0 bg-slate-700 p-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
									validationErrors.pages
										? 'border-2 border-red-500 focus:ring-red-500'
										: 'focus:ring-[#C27AFF]'
								}`}
								placeholder="Jumlah"
								disabled={isLoading}
							/>
							{validationErrors.pages && (
								<div className="mt-1 flex items-center text-sm text-red-500">
									<AlertCircle size={16} className="mr-1" />
									{validationErrors.pages}
								</div>
							)}
						</div>
					</div>

					{/* Authors section */}
					<div>
						<label className="mb-1 block text-lg font-semibold text-gray-300">
							Penulis: <span className="text-red-500">*</span>
						</label>

						{validationErrors.authorGeneral && (
							<div className="mb-2 flex items-center text-sm text-red-500">
								<AlertCircle size={16} className="mr-1" />
								{validationErrors.authorGeneral}
							</div>
						)}

						{authors.map((author, index) => (
							<div key={index} className="mb-2 flex items-center">
								<input
									type="text"
									value={author}
									onChange={(e) => handleAuthorChange(index, e.target.value)}
									list={`author-options-${index}`}
									className={`w-full rounded border-0 bg-slate-700 p-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
										validationErrors.authors?.[index]
											? 'border-2 border-red-500 focus:ring-red-500'
											: 'focus:ring-[#C27AFF]'
									}`}
									placeholder="Nama penulis"
									disabled={isLoading}
								/>

								<datalist id={`author-options-${index}`}>
									{existingAuthors.map((existingAuthor) => (
										<option key={existingAuthor} value={existingAuthor} />
									))}
								</datalist>

								{index === authors.length - 1 ? (
									<button
										type="button"
										onClick={() => setAuthors([...authors, ''])}
										className="ml-2 rounded bg-blue-500 p-3 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
										disabled={isLoading}
									>
										<Plus size={20} />
									</button>
								) : (
									<button
										type="button"
										onClick={() => {
											const newAuthors = [...authors];
											newAuthors.splice(index, 1);
											setAuthors(newAuthors);

											const newErrors = [...validationErrors.authors];
											newErrors.splice(index, 1);
											setValidationErrors({
												...validationErrors,
												authors: newErrors,
											});
										}}
										className="ml-2 rounded bg-red-500 p-3 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
										disabled={isLoading}
									>
										<X size={20} />
									</button>
								)}
							</div>
						))}

						{authors.map(
							(_, index) =>
								validationErrors.authors?.[index] && (
									<div
										key={`error-${index}`}
										className="mt-1 flex items-center text-sm text-red-500"
									>
										<AlertCircle size={16} className="mr-1" />
										{validationErrors.authors[index]}
									</div>
								)
						)}
					</div>

					{/* Publisher field */}
					<div>
						<label className="mb-1 block text-lg font-semibold text-gray-300">
							Penerbit: <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							list="publisher-options"
							value={formData.publisher}
							onChange={(e) => handleInputChange('publisher', e.target.value)}
							className={`w-full rounded border-0 bg-slate-700 p-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
								validationErrors.publisher
									? 'border-2 border-red-500 focus:ring-red-500'
									: 'focus:ring-[#C27AFF]'
							}`}
							placeholder="Nama penerbit"
							disabled={isLoading}
						/>
						<datalist id="publisher-options">
							{existingPublishers.map((publisher) => (
								<option key={publisher} value={publisher} />
							))}
						</datalist>
						{validationErrors.publisher && (
							<div className="mt-1 flex items-center text-sm text-red-500">
								<AlertCircle size={16} className="mr-1" />
								{validationErrors.publisher}
							</div>
						)}
					</div>

					{/* Description field - make it smaller */}
					<div>
						<label className="mb-1 block text-lg font-semibold text-gray-300">
							Deskripsi:
						</label>
						<textarea
							value={formData.description}
							onChange={(e) => handleInputChange('description', e.target.value)}
							className="w-full resize-none rounded border-0 bg-slate-700 p-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C27AFF]"
							rows={3} // Reduced from 4 to 3
							placeholder="Deskripsi singkat tentang buku..."
							disabled={isLoading}
						/>
					</div>
				</div>
			</div>

			{/* Save button - keep at bottom */}
			<div className="bg-slate-800 p-6 pt-3">
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
