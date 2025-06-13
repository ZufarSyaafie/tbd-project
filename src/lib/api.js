export class ApiError extends Error {
	constructor(message, status, data = null) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.data = data;
	}
}

export const apiRequest = async (url, options = {}) => {
	try {
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
			...options,
		});

		const data = await response.json();

		if (!response.ok) {
			throw new ApiError(
				data.error || `HTTP error! status: ${response.status}`,
				response.status,
				data
			);
		}

		return data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		// Network or other errors
		throw new ApiError('Network error or server unavailable', 0, error);
	}
};

// Publisher API functions
export const publisherApi = {
	getAll: async (params = {}) => {
		const searchParams = new URLSearchParams(params);
		return apiRequest(`/api/publishers?${searchParams}`);
	},

	getById: async (id) => {
		return apiRequest(`/api/publishers/${id}`);
	},

	create: async (data) => {
		return apiRequest('/api/publishers', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	update: async (id, data) => {
		return apiRequest(`/api/publishers/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	delete: async (id) => {
		return apiRequest(`/api/publishers/${id}`, {
			method: 'DELETE',
		});
	},
};

// Author API functions
export const authorApi = {
	getAll: async (params = {}) => {
		const searchParams = new URLSearchParams(params);
		return apiRequest(`/api/authors?${searchParams}`);
	},

	getById: async (id) => {
		return apiRequest(`/api/authors/${id}`);
	},

	create: async (data) => {
		return apiRequest('/api/authors', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	update: async (id, data) => {
		return apiRequest(`/api/authors/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	delete: async (id) => {
		return apiRequest(`/api/authors/${id}`, {
			method: 'DELETE',
		});
	},
};

// Book API functions
export const bookApi = {
	getAll: async (params = {}) => {
		const searchParams = new URLSearchParams(params);
		return apiRequest(`/api/books?${searchParams}`);
	},

	getById: async (id) => {
		return apiRequest(`/api/books/${id}`);
	},

	create: async (data) => {
		return apiRequest('/api/books', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	update: async (id, data) => {
		return apiRequest(`/api/books/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	delete: async (id) => {
		return apiRequest(`/api/books/${id}`, {
			method: 'DELETE',
		});
	},

	getSuggestions: async (type, query) => {
		const params = new URLSearchParams({ type, query });
		return apiRequest(`/api/books/suggestions?${params}`);
	},
};
