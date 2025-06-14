import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Create book-author relationships
export async function POST(request) {
	try {
		const { bookId, authorIds } = await request.json();

		if (!bookId || !authorIds || !Array.isArray(authorIds)) {
			return NextResponse.json(
				{
					success: false,
					error: 'Invalid data: bookId and authorIds array required',
				},
				{ status: 400 }
			);
		}

		const relationships = authorIds.map((authorId) => ({
			buku_id: parseInt(bookId),
			penulis_id: parseInt(authorId),
		}));

		const { data, error } = await supabase
			.from('Buku_Penulis')
			.insert(relationships)
			.select();

		if (error) throw error;

		return NextResponse.json({
			success: true,
			data,
			message: 'Book-author relationships created successfully',
		});
	} catch (error) {
		console.error('Error creating book-author relationships:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

// Delete book-author relationship
export async function DELETE(request) {
	try {
		const { searchParams } = new URL(request.url);
		const bookId = searchParams.get('bookId');
		const authorId = searchParams.get('authorId');

		if (!bookId) {
			return NextResponse.json(
				{ success: false, error: 'bookId is required' },
				{ status: 400 }
			);
		}

		let query = supabase.from('Buku_Penulis').delete().eq('buku_id', bookId);

		if (authorId) {
			query = query.eq('penulis_id', authorId);
		}

		const { error } = await query;

		if (error) throw error;

		return NextResponse.json({
			success: true,
			message: 'Book-author relationship(s) deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting book-author relationships:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
