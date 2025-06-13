// app/api/publishers/route.js
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
			.from('Penerbit')
			.select('*', { count: 'exact', head: true });

		if (countError) throw countError;

		// Get paginated data
		const { data, error } = await supabase
			.from('Penerbit')
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
		console.error('Error fetching publishers:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	try {
		const body = await request.json();

		const { data, error } = await supabase
			.from('Penerbit')
			.insert([body])
			.select()
			.single();

		if (error) throw error;

		return NextResponse.json({
			success: true,
			data,
			message: 'Publisher created successfully',
		});
	} catch (error) {
		console.error('Error creating publisher:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
