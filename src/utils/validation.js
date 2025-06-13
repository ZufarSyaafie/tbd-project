export const validatePublisher = (data) => {
	const errors = {};

	if (!data.nama_penerbit?.trim()) {
		errors.nama_penerbit = 'Nama penerbit harus diisi';
	}

	if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
		errors.email = 'Format email tidak valid';
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};

export const validateAuthor = (data) => {
	const errors = {};

	if (!data.nama_penulis?.trim()) {
		errors.nama_penulis = 'Nama penulis harus diisi';
	}

	if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
		errors.email = 'Format email tidak valid';
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};

export const validateBook = (data) => {
	const errors = {};

	if (!data.judul?.trim()) {
		errors.judul = 'Judul buku harus diisi';
	}

	if (!data.genre?.trim()) {
		errors.genre = 'Genre harus diisi';
	}

	if (!data.penerbit_id) {
		errors.penerbit_id = 'Penerbit harus dipilih';
	}

	if (data.jumlah_halaman && data.jumlah_halaman < 1) {
		errors.jumlah_halaman = 'Jumlah halaman harus lebih dari 0';
	}

	if (data.tahun_terbit) {
		const year = new Date(data.tahun_terbit).getFullYear();
		const currentYear = new Date().getFullYear();
		if (year < 1000 || year > currentYear + 10) {
			errors.tahun_terbit = 'Tahun terbit tidak valid';
		}
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};
