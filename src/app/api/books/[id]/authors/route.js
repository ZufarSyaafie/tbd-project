import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Get authors for a specific book
export async function GET(request, { params }) {
	try {
		const { id } = params;

		if (!id) {
			return NextResponse.json(
				{ success: false, error: 'Book ID is required' },
				{ status: 400 }
			);
		}

		const { data, error } = await supabase
			.from('Buku_Penulis')
			.select(
				`
				penulis_id,
				Penulis (
					id,
					nama_penulis,
					email
				)
			`
			)
			.eq('buku_id', id);

		if (error) throw error;

		const authors = data.map((item) => ({
			id: item.Penulis.id,
			nama_penulis: item.Penulis.nama_penulis,
			email: item.Penulis.email,
		}));

		return NextResponse.json({
			success: true,
			data: authors,
			message: 'Book authors retrieved successfully',
		});
	} catch (error) {
		console.error('Error fetching book authors:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

// Update book-author relationships (replace existing relationships)
export async function PUT(request, { params }) {
	try {
		const { id } = params;
		const { authorIds } = await request.json();

		if (!id) {
			return NextResponse.json(
				{ success: false, error: 'Book ID is required' },
				{ status: 400 }
			);
		}

		if (!authorIds || !Array.isArray(authorIds)) {
			return NextResponse.json(
				{
					success: false,
					error: 'Invalid data: authorIds array required',
				},
				{ status: 400 }
			);
		}

		// Start a transaction-like operation
		// First, delete existing relationships
		const { error: deleteError } = await supabase
			.from('Buku_Penulis')
			.delete()
			.eq('buku_id', id);

		if (deleteError) throw deleteError;

		// Then, insert new relationships if authorIds is not empty
		if (authorIds.length > 0) {
			const relationships = authorIds.map((authorId) => ({
				buku_id: parseInt(id),
				penulis_id: parseInt(authorId),
			}));

			const { data, error: insertError } = await supabase
				.from('Buku_Penulis')
				.insert(relationships)
				.select();

			if (insertError) throw insertError;

			return NextResponse.json({
				success: true,
				data,
				message: 'Book-author relationships updated successfully',
			});
		} else {
			// If no authors provided, just return success (all relationships deleted)
			return NextResponse.json({
				success: true,
				data: [],
				message: 'All book-author relationships removed successfully',
			});
		}
	} catch (error) {
		console.error('Error updating book-author relationships:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

// Add new authors to a book (without removing existing ones)
export async function POST(request, { params }) {
	try {
		const { id } = params;
		const { authorIds } = await request.json();

		if (!id) {
			return NextResponse.json(
				{ success: false, error: 'Book ID is required' },
				{ status: 400 }
			);
		}

		if (!authorIds || !Array.isArray(authorIds)) {
			return NextResponse.json(
				{
					success: false,
					error: 'Invalid data: authorIds array required',
				},
				{ status: 400 }
			);
		}

		// Check for existing relationships to avoid duplicates
		const { data: existingRelations, error: checkError } = await supabase
			.from('Buku_Penulis')
			.select('penulis_id')
			.eq('buku_id', id)
			.in('penulis_id', authorIds);

		if (checkError) throw checkError;

		const existingAuthorIds = existingRelations.map((rel) => rel.penulis_id);
		const newAuthorIds = authorIds.filter(
			(authorId) => !existingAuthorIds.includes(parseInt(authorId))
		);

		if (newAuthorIds.length === 0) {
			return NextResponse.json({
				success: true,
				data: [],
				message: 'All specified authors are already associated with this book',
			});
		}

		const relationships = newAuthorIds.map((authorId) => ({
			buku_id: parseInt(id),
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
			message: 'New book-author relationships added successfully',
		});
	} catch (error) {
		console.error('Error adding book-author relationships:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

// Remove specific authors from a book
export async function DELETE(request, { params }) {
	try {
		const { id } = params;
		const { searchParams } = new URL(request.url);
		const authorIds = searchParams.get('authorIds');

		if (!id) {
			return NextResponse.json(
				{ success: false, error: 'Book ID is required' },
				{ status: 400 }
			);
		}

		let query = supabase.from('Buku_Penulis').delete().eq('buku_id', id);

		// If specific author IDs are provided, only delete those relationships
		if (authorIds) {
			const authorIdArray = authorIds
				.split(',')
				.map((id) => parseInt(id.trim()));
			query = query.in('penulis_id', authorIdArray);
		}

		const { error } = await query;

		if (error) throw error;

		const message = authorIds
			? 'Specific book-author relationships deleted successfully'
			: 'All book-author relationships deleted successfully';

		return NextResponse.json({
			success: true,
			message,
		});
	} catch (error) {
		console.error('Error deleting book-author relationships:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
