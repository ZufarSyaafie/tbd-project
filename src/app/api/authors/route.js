import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page')) || 1;
		const limit = parseInt(searchParams.get('limit')) || 25;
		const offset = (page - 1) * limit;

		// Get total count
		const { count, error: countError } = await supabase
			.from('Penulis')
			.select('*', { count: 'exact', head: true });

		if (countError) throw countError;

		// Get paginated data
		const { data, error } = await supabase
			.from('Penulis')
			.select('*')
			.range(offset, offset + limit - 1)
			.order('id', { ascending: true });

		if (error) throw error;

		return NextResponse.json({
			success: true,
			data: data || [],
			totalItems: count || 0,
			totalPages: Math.ceil((count || 0) / limit),
			currentPage: page,
		});
	} catch (error) {
		console.error('Error fetching authors:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
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
			.insert([{
				nama_penulis: body.nama_penulis.trim(),
				email: body.email ? body.email.trim() : null
			}])
			.select()
			.single();

		if (error) throw error;

		return NextResponse.json({
			success: true,
			data,
			message: 'Author created successfully',
		});
	} catch (error) {
		console.error('Error creating author:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}