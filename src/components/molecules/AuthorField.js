'use client';
import React, { useState } from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';

export default function AuthorField({
	authors,
	setAuthors,
	existingAuthors,
	disabled = false,
	validationErrors = [],
	onAuthorChange,
}) {
	const handleAuthorChange = (index, value) => {
		const newAuthors = [...authors];
		newAuthors[index] = value;
		setAuthors(newAuthors);

		if (onAuthorChange) {
			onAuthorChange(index, value);
		}
	};

	const addAuthor = () => {
		if (!disabled) {
			setAuthors([...authors, '']);
		}
	};

	const removeAuthor = (index) => {
		if (!disabled && authors.length > 1) {
			setAuthors(authors.filter((_, i) => i !== index));
		}
	};

	return (
		<div className="space-y-2">
			<label className="mb-2 block text-lg font-semibold text-gray-300">
				Penulis <span className="text-red-500">*</span>
			</label>

			{authors.map((author, index) => (
				<div key={index} className="mb-2 flex items-center">
					<input
						type="text"
						value={author}
						onChange={(e) => handleAuthorChange(index, e.target.value)}
						list={`author-options-${index}`}
						className={`w-full rounded border-0 bg-slate-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
							validationErrors[index]
								? 'border-2 border-red-500 focus:ring-red-500'
								: 'focus:ring-[#C27AFF]'
						}`}
						placeholder="Nama penulis"
						disabled={disabled}
					/>

					<datalist id={`author-options-${index}`}>
						{existingAuthors?.map((existingAuthor) => (
							<option key={existingAuthor} value={existingAuthor} />
						))}
					</datalist>

					{index === authors.length - 1 ? (
						<button
							type="button"
							onClick={addAuthor}
							className="ml-2 rounded bg-blue-500 p-3 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
							disabled={disabled}
						>
							<Plus size={20} />
						</button>
					) : (
						<button
							type="button"
							onClick={() => removeAuthor(index)}
							className="ml-2 rounded bg-red-500 p-3 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
							disabled={disabled}
						>
							<X size={20} />
						</button>
					)}
				</div>
			))}

			{validationErrors?.map((error, index) =>
				error ? (
					<div
						key={`error-${index}`}
						className="mt-1 flex items-center text-sm text-red-500"
					>
						<AlertCircle size={16} className="mr-1" />
						{error}
					</div>
				) : null
			)}
		</div>
	);
}
