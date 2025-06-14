'use client';
import { useState, useEffect } from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import { yearOptions, genreOptions } from '@/lib/options';
import { bookApi, authorApi, publisherApi } from '@/lib/api';
import { validateBook } from '@/utils/validation';

export default function CompleteBookForm({
	onClose,
	onBookAdded,
	bookToEdit = null,
}) {
	const [formData, setFormData] = useState({
		judul: '',
		genre: '',
		tahun_terbit: '',
		jumlah_halaman: '',
		penerbit_id: '',
		deskripsi: '',
	});

	const [authors, setAuthors] = useState(['']);
	const [existingAuthors, setExistingAuthors] = useState([]);
	const [existingPublishers, setExistingPublishers] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	// New state for validation errors
	const [validationErrors, setValidationErrors] = useState({
		judul: '',
		genre: '',
		tahun_terbit: '',
		jumlah_halaman: '',
		penerbit_id: '',
		authors: [],
	});

	// Validation functions
	const validateAuthor = (value) => {
		if (value && !/^[a-zA-Z\s\-'.]+$/.test(value)) {
			return "Nama penulis hanya boleh berisi huruf, spasi, dan tanda (-')";
		}
		return '';
	};

	const validatePublisher = (value) => {
		if (value && !/^[a-zA-Z\s\-'.&()!?]+$/.test(value)) {
			return "Nama penerbit hanya boleh berisi huruf, spasi, dan tanda baca umum -'.&(),!?";
		}
		return '';
	};

	const validatePages = (value) => {
		if (!/^[0-9]+$/.test(value) || parseInt(value, 10) <= 0) {
			return 'Harus berupa angka bulat positif';
		}
		return '';
	};

	// Fetch existing authors and publishers using API
	useEffect(() => {
		fetchExistingData();
	}, []);

	const fetchExistingData = async () => {
		try {
			setIsLoading(true);

			// Fetch authors using API
			const authorsResponse = await authorApi.getAll();
			if (authorsResponse.success) {
				setExistingAuthors(
					authorsResponse.data.map((author) => author.nama_penulis)
				);
			}

			// Fetch publishers using API
			const publishersResponse = await publisherApi.getAll();
			if (publishersResponse.success) {
				setExistingPublishers(publishersResponse.data);
			}
		} catch (error) {
			console.error('Error fetching existing data:', error);
			setError('Gagal memuat data penulis dan penerbit');
		} finally {
			setIsLoading(false);
		}
	};

	// Function to convert year to date (January 1st of that year)
	const convertYearToDate = (year) => {
		if (!year) return null;
		return `${year}-01-01`;
	};

	// Function to get or create publisher using API
	const getOrCreatePublisher = async (publisherName) => {
		try {
			// Check if publisher exists in our local state
			const existingPublisher = existingPublishers.find(
				(pub) => pub.nama_penerbit === publisherName
			);

			if (existingPublisher) {
				return existingPublisher.id;
			}

			// Create new publisher using API
			const response = await publisherApi.create({
				nama_penerbit: publisherName,
			});

			if (response.success) {
				// Update local state
				setExistingPublishers((prev) => [...prev, response.data]);
				return response.data.id;
			} else {
				throw new Error(response.error || 'Failed to create publisher');
			}
		} catch (error) {
			console.error('Error with publisher:', error);
			throw error;
		}
	};

	// Function to get or create authors using API
	const getOrCreateAuthors = async (authorNames) => {
		try {
			const authorIds = [];

			for (const authorName of authorNames) {
				// Check if author exists by fetching all authors and finding match
				const authorsResponse = await authorApi.getAll();
				const existingAuthor = authorsResponse.data?.find(
					(author) => author.nama_penulis === authorName
				);

				if (existingAuthor) {
					authorIds.push(existingAuthor.id);
				} else {
					// Create new author using API
					const response = await authorApi.create({
						nama_penulis: authorName,
					});

					if (response.success) {
						authorIds.push(response.data.id);
					} else {
						throw new Error(response.error || 'Failed to create author');
					}
				}
			}

			return authorIds;
		} catch (error) {
			console.error('Error with authors:', error);
			throw error;
		}
	};

	// Function to create book-author relationships
	const createBookAuthorRelationships = async (bookId, authorIds) => {
		try {
			const response = await fetch('/api/book-authors', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					bookId: bookId,
					authorIds: authorIds,
				}),
			});

			const result = await response.json();

			if (!result.success) {
				throw new Error(
					result.error || 'Failed to create book-author relationships'
				);
			}

			return result;
		} catch (error) {
			console.error('Error creating book-author relationships:', error);
			throw error;
		}
	};

	// Function to update book-author relationships
	const updateBookAuthorRelationships = async (bookId, authorIds) => {
		try {
			const response = await fetch(`/api/books/${bookId}/authors`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					authorIds: authorIds,
				}),
			});

			const result = await response.json();

			if (!result.success) {
				throw new Error(
					result.error || 'Failed to update book-author relationships'
				);
			}

			return result;
		} catch (error) {
			console.error('Error updating book-author relationships:', error);
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
			case 'jumlah_halaman':
				validationError = validatePages(value);
				break;
			case 'penerbit_id':
				// For publisher, we're storing the name but need ID later
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

	// Handler for author input with validation
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

	// Populate form with book data when editing
	useEffect(() => {
		if (bookToEdit) {
			setFormData({
				judul: bookToEdit.judul || '',
				genre: bookToEdit.genre || '',
				tahun_terbit: bookToEdit.tahun_terbit
					? new Date(bookToEdit.tahun_terbit).getFullYear().toString()
					: '',
				jumlah_halaman: bookToEdit.jumlah_halaman?.toString() || '',
				penerbit_id: bookToEdit.penerbit || '', // Store publisher name for display
				deskripsi: bookToEdit.deskripsi || '',
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

	// Updated submit handler using API
	const handleSubmit = async () => {
		// Filter out empty authors
		const filteredAuthors = authors.filter((a) => a.trim() !== '');

		// Validate all fields before submission
		const errors = {
			judul: !formData.judul ? 'Judul buku wajib diisi' : '',
			genre: !formData.genre ? 'Genre wajib diisi' : '',
			tahun_terbit: !formData.tahun_terbit ? 'Tahun terbit wajib diisi' : '',
			jumlah_halaman: !formData.jumlah_halaman
				? 'Jumlah halaman wajib diisi'
				: validatePages(formData.jumlah_halaman),
			penerbit_id: !formData.penerbit_id
				? 'Penerbit wajib diisi'
				: validatePublisher(formData.penerbit_id),
			authors: [],
		};

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
			// Get or create publisher (returns publisher ID)
			const publisherId = await getOrCreatePublisher(formData.penerbit_id);

			// Get or create authors (returns array of author IDs)
			const authorIds = await getOrCreateAuthors(filteredAuthors);

			// Convert year to date
			const publishDate = convertYearToDate(formData.tahun_terbit);

			// Prepare book data for API
			const bookData = {
				judul: formData.judul,
				genre: formData.genre,
				tahun_terbit: publishDate,
				jumlah_halaman: parseInt(formData.jumlah_halaman),
				deskripsi: formData.deskripsi || null,
				penerbit_id: publisherId,
			};

			let response;
			let bookId;

			if (bookToEdit) {
				// UPDATE EXISTING BOOK using API
				response = await bookApi.update(bookToEdit.id, bookData);
				bookId = bookToEdit.id;
			} else {
				// CREATE NEW BOOK using API
				response = await bookApi.create(bookData);
				bookId = response.data.id;
			}

			if (!response.success) {
				throw new Error(response.error || 'Failed to save book');
			}

			// Handle book-author relationships
			if (bookToEdit) {
				// Update existing book-author relationships
				await updateBookAuthorRelationships(bookId, authorIds);
			} else {
				// Create new book-author relationships
				await createBookAuthorRelationships(bookId, authorIds);
			}

			alert(
				bookToEdit ? 'Buku berhasil diperbarui!' : 'Buku berhasil disimpan!'
			);

			// Reset form
			setFormData({
				judul: '',
				genre: '',
				tahun_terbit: '',
				jumlah_halaman: '',
				penerbit_id: '',
				deskripsi: '',
			});
			setAuthors(['']);
			setValidationErrors({
				judul: '',
				genre: '',
				tahun_terbit: '',
				jumlah_halaman: '',
				penerbit_id: '',
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
					{/* Title field */}
					<div>
						<label className="mb-1 block text-lg font-semibold text-gray-300">
							Judul: <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							value={formData.judul}
							onChange={(e) => handleInputChange('judul', e.target.value)}
							className={`w-full rounded border-0 bg-slate-700 p-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
								validationErrors.judul
									? 'border-2 border-red-500 focus:ring-red-500'
									: 'focus:ring-[#C27AFF]'
							}`}
							placeholder="Masukkan judul buku"
							disabled={isLoading}
						/>
						{validationErrors.judul && (
							<div className="mt-1 flex items-center text-sm text-red-500">
								<AlertCircle size={16} className="mr-1" />
								{validationErrors.judul}
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
								value={formData.tahun_terbit}
								onChange={(e) =>
									handleInputChange('tahun_terbit', e.target.value)
								}
								className={`w-full rounded border-0 bg-slate-700 p-2.5 text-white focus:outline-none focus:ring-2 ${
									validationErrors.tahun_terbit
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
							{validationErrors.tahun_terbit && (
								<div className="mt-1 flex items-center text-sm text-red-500">
									<AlertCircle size={16} className="mr-1" />
									{validationErrors.tahun_terbit}
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
								value={formData.jumlah_halaman}
								onChange={(e) =>
									handleInputChange('jumlah_halaman', e.target.value)
								}
								className={`w-full rounded border-0 bg-slate-700 p-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
									validationErrors.jumlah_halaman
										? 'border-2 border-red-500 focus:ring-red-500'
										: 'focus:ring-[#C27AFF]'
								}`}
								placeholder="Jumlah"
								disabled={isLoading}
							/>
							{validationErrors.jumlah_halaman && (
								<div className="mt-1 flex items-center text-sm text-red-500">
									<AlertCircle size={16} className="mr-1" />
									{validationErrors.jumlah_halaman}
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
							value={formData.penerbit_id}
							onChange={(e) => handleInputChange('penerbit_id', e.target.value)}
							className={`w-full rounded border-0 bg-slate-700 p-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
								validationErrors.penerbit_id
									? 'border-2 border-red-500 focus:ring-red-500'
									: 'focus:ring-[#C27AFF]'
							}`}
							placeholder="Nama penerbit"
							disabled={isLoading}
						/>
						<datalist id="publisher-options">
							{existingPublishers.map((publisher) => (
								<option key={publisher.id} value={publisher.nama_penerbit} />
							))}
						</datalist>
						{validationErrors.penerbit_id && (
							<div className="mt-1 flex items-center text-sm text-red-500">
								<AlertCircle size={16} className="mr-1" />
								{validationErrors.penerbit_id}
							</div>
						)}
					</div>

					{/* Description field */}
					<div>
						<label className="mb-1 block text-lg font-semibold text-gray-300">
							Deskripsi:
						</label>
						<textarea
							value={formData.deskripsi}
							onChange={(e) => handleInputChange('deskripsi', e.target.value)}
							className="w-full resize-none rounded border-0 bg-slate-700 p-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C27AFF]"
							rows={3}
							placeholder="Deskripsi singkat tentang buku..."
							disabled={isLoading}
						/>
					</div>
				</div>
			</div>

			{/* Save button */}
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
