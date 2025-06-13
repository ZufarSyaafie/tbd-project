import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
	try {
		const { data, error } = await supabase
			.from('Penerbit')
			.select('*')
			.eq('id', params.id)
			.single();

		if (error) throw error;

		return NextResponse.json({
			success: true,
			data,
		});
	} catch (error) {
		console.error('Error fetching publisher:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

export async function PUT(request, { params }) {
	try {
		const body = await request.json();

		const { data, error } = await supabase
			.from('Penerbit')
			.update(body)
			.eq('id', params.id)
			.select()
			.single();

		if (error) throw error;

		return NextResponse.json({
			success: true,
			data,
			message: 'Publisher updated successfully',
		});
	} catch (error) {
		console.error('Error updating publisher:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

export async function DELETE(request, { params }) {
	try {
		const { error } = await supabase
			.from('Penerbit')
			.delete()
			.eq('id', params.id);

		if (error) throw error;

		return NextResponse.json({
			success: true,
			message: 'Publisher deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting publisher:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
