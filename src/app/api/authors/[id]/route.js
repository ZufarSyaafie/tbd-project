import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET specific author by ID
export async function GET(request, { params }) {
	try {
		const { data, error } = await supabase
			.from('Penulis')
			.select('*')
			.eq('id', params.id)
			.single();

		if (error) {
			if (error.code === 'PGRST116') {
				return NextResponse.json(
					{ success: false, error: 'Penulis tidak ditemukan' },
					{ status: 404 }
				);
			}
			throw error;
		}

		return NextResponse.json({
			success: true,
			data,
		});
	} catch (error) {
		console.error('Error fetching author:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

// UPDATE specific author by ID
export async function PUT(request, { params }) {
	try {
		const body = await request.json();

		// Validate required fields
		if (!body.nama_penulis || body.nama_penulis.trim() === '') {
			return NextResponse.json(
				{ success: false, error: 'Nama penulis wajib diisi' },
				{ status: 400 }
			);
		}

		// Validate email format if provided
		if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
			return NextResponse.json(
				{ success: false, error: 'Format email tidak valid' },
				{ status: 400 }
			);
		}

		const { data, error } = await supabase
			.from('Penulis')
			.update({
				nama_penulis: body.nama_penulis.trim(),
				email: body.email ? body.email.trim() : null
			})
			.eq('id', params.id)
			.select()
			.single();

		if (error) {
			if (error.code === 'PGRST116') {
				return NextResponse.json(
					{ success: false, error: 'Penulis tidak ditemukan' },
					{ status: 404 }
				);
			}
			throw error;
		}

		return NextResponse.json({
			success: true,
			data,
			message: 'Author updated successfully',
		});
	} catch (error) {
		console.error('Error updating author:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

// DELETE specific author by ID
export async function DELETE(request, { params }) {
	try {
		// First, delete all relationships in Buku_Penulis table
		const { error: relationDeleteError } = await supabase
			.from('Buku_Penulis')
			.delete()
			.eq('penulis_id', params.id);

		if (relationDeleteError) {
			console.error('Error deleting author relations:', relationDeleteError);
			// Continue anyway, might not have any relations
		}

		// Then delete the author
		const { data, error: deleteError } = await supabase
			.from('Penulis')
			.delete()
			.eq('id', params.id)
			.select('nama_penulis')
			.single();

		if (deleteError) {
			if (deleteError.code === 'PGRST116') {
				return NextResponse.json(
					{ success: false, error: 'Penulis tidak ditemukan' },
					{ status: 404 }
				);
			}
			throw deleteError;
		}

		return NextResponse.json({
			success: true,
			message: `Penulis "${data?.nama_penulis || 'Unknown'}" berhasil dihapus beserta semua hubungan bukunya`,
		});
	} catch (error) {
		console.error('Error deleting author:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}