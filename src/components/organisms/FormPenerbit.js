'use client';
import { X, AlertCircle } from 'lucide-react';
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
		countryCode: '+62',
		phone: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	// Country codes data
	const countryCodes = [
		{ code: '+62', country: 'Indonesia', flag: '🇮🇩' },
		{ code: '+60', country: 'Malaysia', flag: '🇲🇾' },
		{ code: '+65', country: 'Singapore', flag: '🇸🇬' },
		{ code: '+66', country: 'Thailand', flag: '🇹🇭' },
		{ code: '+84', country: 'Vietnam', flag: '🇻🇳' },
		{ code: '+63', country: 'Philippines', flag: '🇵🇭' },
		{ code: '+855', country: 'Cambodia', flag: '🇰🇭' },
		{ code: '+856', country: 'Laos', flag: '🇱🇦' },
		{ code: '+95', country: 'Myanmar', flag: '🇲🇲' },
		{ code: '+673', country: 'Brunei', flag: '🇧🇳' },
		{ code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
		{ code: '+44', country: 'UK', flag: '🇬🇧' },
		{ code: '+49', country: 'Germany', flag: '🇩🇪' },
		{ code: '+33', country: 'France', flag: '🇫🇷' },
		{ code: '+39', country: 'Italy', flag: '🇮🇹' },
		{ code: '+34', country: 'Spain', flag: '🇪🇸' },
		{ code: '+31', country: 'Netherlands', flag: '🇳🇱' },
		{ code: '+41', country: 'Switzerland', flag: '🇨🇭' },
		{ code: '+43', country: 'Austria', flag: '🇦🇹' },
		{ code: '+46', country: 'Sweden', flag: '🇸🇪' },
		{ code: '+47', country: 'Norway', flag: '🇳🇴' },
		{ code: '+45', country: 'Denmark', flag: '🇩🇰' },
		{ code: '+358', country: 'Finland', flag: '🇫🇮' },
		{ code: '+7', country: 'Russia', flag: '🇷🇺' },
		{ code: '+48', country: 'Poland', flag: '🇵🇱' },
		{ code: '+81', country: 'Japan', flag: '🇯🇵' },
		{ code: '+82', country: 'South Korea', flag: '🇰🇷' },
		{ code: '+86', country: 'China', flag: '🇨🇳' },
		{ code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
		{ code: '+853', country: 'Macau', flag: '🇲🇴' },
		{ code: '+886', country: 'Taiwan', flag: '🇹🇼' },
		{ code: '+91', country: 'India', flag: '🇮🇳' },
		{ code: '+92', country: 'Pakistan', flag: '🇵🇰' },
		{ code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
		{ code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
		{ code: '+61', country: 'Australia', flag: '🇦🇺' },
		{ code: '+64', country: 'New Zealand', flag: '🇳🇿' },
		{ code: '+20', country: 'Egypt', flag: '🇪🇬' },
		{ code: '+27', country: 'South Africa', flag: '🇿🇦' },
		{ code: '+234', country: 'Nigeria', flag: '🇳🇬' },
		{ code: '+971', country: 'UAE', flag: '🇦🇪' },
		{ code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
		{ code: '+90', country: 'Turkey', flag: '🇹🇷' },
		{ code: '+98', country: 'Iran', flag: '🇮🇷' },
		{ code: '+55', country: 'Brazil', flag: '🇧🇷' },
		{ code: '+54', country: 'Argentina', flag: '🇦🇷' },
		{ code: '+52', country: 'Mexico', flag: '🇲🇽' },
		{ code: '+56', country: 'Chile', flag: '🇨🇱' },
		{ code: '+57', country: 'Colombia', flag: '🇨🇴' },
	];

	// New state for validation errors
	const [validationErrors, setValidationErrors] = useState({
		name: '',
		phone: '',
	});

	// Validation functions
	const validateName = (value) => {
		// Name should only contain letters, spaces, and common punctuation for publisher names
		if (value && !/^[a-zA-Z\s\-'.&(),]+$/.test(value)) {
			return 'Nama penerbit hanya boleh berisi huruf, spasi, dan tanda baca umum (-\'.&(),)';
		}
		return '';
	};

	const validatePhone = (value) => {
		if (value && !/^[\d\-]+$/.test(value)) {
			return 'Nomor telepon hanya boleh berisi angka dan tanda hubung (tanpa spasi)';
		}
		const digitsOnly = value.replace(/\D/g, '');
		if (value && (digitsOnly.length < 6 || digitsOnly.length > 12)) {
			return 'Nomor telepon harus memiliki 6-12 digit';
		}
	
		return '';
	};
	

	// Populate form jika edit
	useEffect(() => {
		if (publisherToEdit) {
			// Parse phone number to separate country code and local number
			let countryCode = '+62';
			let localPhone = publisherToEdit.no_telpon || '';
			
			if (publisherToEdit.no_telpon) {
				// Try to extract country code from existing phone number
				const phoneStr = publisherToEdit.no_telpon.replace(/\s/g, '');
				const matchedCode = countryCodes.find(cc => phoneStr.startsWith(cc.code));
				if (matchedCode) {
					countryCode = matchedCode.code;
					localPhone = phoneStr.substring(matchedCode.code.length);
				}
			}

			setFormData({
				name: publisherToEdit.nama_penerbit || '',
				address: publisherToEdit.alamat_penerbit || '',
				countryCode: countryCode,
				phone: localPhone,
			});
		}
	}, [publisherToEdit]);

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));

		// Validate input based on field type
		let validationError = '';
		switch (field) {
			case 'name':
				validationError = validateName(value);
				break;
			case 'phone':
				validationError = validatePhone(value);
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

	const handleSubmit = async () => {
		// Validate all fields before submission
		const errors = {
			name: !formData.name ? 'Nama penerbit wajib diisi' : validateName(formData.name),
			phone: formData.phone ? validatePhone(formData.phone) : '',
		};

		// Check if we have any validation errors
		const hasErrors = Object.values(errors).some(err => err !== '');

		if (hasErrors) {
			setValidationErrors(errors);
			alert('Ada kesalahan pada form. Silakan periksa kembali input Anda.');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			// Combine country code and phone number
			const fullPhoneNumber = formData.phone ? `${formData.countryCode} ${formData.phone}` : null;

			if (publisherToEdit) {
				// Update penerbit
				const { error } = await supabase
					.from('Penerbit')
					.update({
						nama_penerbit: formData.name,
						alamat_penerbit: formData.address || null,
						no_telpon: fullPhoneNumber,
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
						no_telpon: fullPhoneNumber,
					},
				]);

				if (error) throw error;
				alert('Penerbit berhasil ditambahkan!');
			}

			// Reset form
			setFormData({ name: '', address: '', countryCode: '+62', phone: '' });
			setValidationErrors({ name: '', phone: '' });

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
						Nama Penerbit: <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						value={formData.name}
						onChange={(e) => handleInputChange('name', e.target.value)}
						className={`w-full rounded border-0 bg-slate-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
							validationErrors.name
								? 'border-2 border-red-500 focus:ring-red-500'
								: 'focus:ring-[#C27AFF]'
						}`}
						placeholder="Masukkan nama penerbit"
						disabled={isLoading}
					/>
					{validationErrors.name && (
						<div className="mt-1 flex items-center text-sm text-red-500">
							<AlertCircle size={16} className="mr-1" />
							{validationErrors.name}
						</div>
					)}
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
					<div className="flex gap-2">
						{/* Country Code Dropdown */}
						<select
							value={formData.countryCode}
							onChange={(e) => handleInputChange('countryCode', e.target.value)}
							className="rounded border-0 bg-slate-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C27AFF]"
							disabled={isLoading}
						>
							{countryCodes.map((country) => (
								<option key={country.code} value={country.code}>
									{country.flag} {country.code}
								</option>
							))}
						</select>
						
						{/* Phone Number Input */}
						<input
							type="tel"
							value={formData.phone}
							onChange={(e) => handleInputChange('phone', e.target.value)}
							className={`flex-1 rounded border-0 bg-slate-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
								validationErrors.phone
									? 'border-2 border-red-500 focus:ring-red-500'
									: 'focus:ring-[#C27AFF]'
							}`}
							placeholder="Contoh: 811-2345-6789 atau 81234567890"
							disabled={isLoading}
						/>
					</div>
					{validationErrors.phone && (
						<div className="mt-1 flex items-center text-sm text-red-500">
							<AlertCircle size={16} className="mr-1" />
							{validationErrors.phone}
						</div>
					)}
					{formData.phone && !validationErrors.phone && (
						<div className="mt-1 text-sm text-gray-400">
							Nomor lengkap: {formData.countryCode} {formData.phone}
						</div>
					)}
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