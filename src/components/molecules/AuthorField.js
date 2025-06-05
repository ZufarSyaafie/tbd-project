'use client';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function AuthorField({ authors, setAuthors, existingAuthors }) {
	const addAuthor = () => {
		setAuthors([...authors, '']);
	};

	const removeAuthor = (index) => {
		if (authors.length > 1) {
			setAuthors(authors.filter((_, i) => i !== index));
		}
	};

	const updateAuthor = (index, value) => {
		const newAuthors = [...authors];
		newAuthors[index] = value;
		setAuthors(newAuthors);
	};

	return (
		<div>
			<label className="mb-2 block text-lg font-semibold text-gray-300">
				Penulis:
			</label>
			{authors.map((author, index) => (
				<div key={index} className="mb-2 flex items-center gap-2">
					<input
						list="author-options"
						value={author}
						onChange={(e) => updateAuthor(index, e.target.value)}
						className="flex-1 rounded border-0 bg-slate-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
						placeholder={
							index === 0 ? 'Penulis utama (wajib)' : 'Penulis tambahan'
						}
					/>
					{authors.length > 1 && (
						<button
							type="button"
							onClick={() => removeAuthor(index)}
							className="size-7 rounded bg-[#FB64B6] text-white transition-colors hover:bg-[#FF008A]"
						>
							<X size={15} strokeWidth={4} className="m-auto" />
						</button>
					)}
				</div>
			))}
			<button
				type="button"
				onClick={addAuthor}
				className="flex items-center gap-2 rounded bg-[#C27AFF] px-3 py-2 text-white transition-colors hover:bg-purple-600"
			>
				<Plus size={15} strokeWidth={4} />
				Tambah Penulis
			</button>

			{/* Datalist untuk autocomplete penulis */}
			<datalist id="author-options">
				{existingAuthors.map((author) => (
					<option key={author} value={author} />
				))}
			</datalist>
		</div>
	);
}
