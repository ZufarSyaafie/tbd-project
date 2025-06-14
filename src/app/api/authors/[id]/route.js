import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Get all authors for a specific book
export async function GET(request, { params }) {
	try {
		const { data, error } = await supabase
			.from('Buku_Penulis')
			.select(
				`
        penulis_id,
        Penulis (
          id,
          nama_penulis
        )
      `
			)
			.eq('buku_id', params.id);

		if (error) throw error;

		return NextResponse.json({
			success: true,
			data: data || [],
		});
	} catch (error) {
		console.error('Error fetching book authors:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

// Update authors for a specific book
export async function PUT(request, { params }) {
	try {
		const { authorIds } = await request.json();
		const bookId = params.id;

		// Start a transaction by deleting existing relationships
		const { error: deleteError } = await supabase
			.from('Buku_Penulis')
			.delete()
			.eq('buku_id', bookId);

		if (deleteError) throw deleteError;

		// Insert new relationships if there are authors
		if (authorIds && authorIds.length > 0) {
			const relationships = authorIds.map((authorId) => ({
				buku_id: parseInt(bookId),
				penulis_id: parseInt(authorId),
			}));

			const { error: insertError } = await supabase
				.from('Buku_Penulis')
				.insert(relationships);

			if (insertError) throw insertError;
		}

		return NextResponse.json({
			success: true,
			message: 'Book authors updated successfully',
		});
	} catch (error) {
		console.error('Error updating book authors:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
