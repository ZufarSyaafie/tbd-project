import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
	try {
		const { data, error } = await supabase
			.from('buku_detail_view')
			.select('*')
			.eq('buku_id', params.id)
			.single();

		if (error) throw error;

		// Transform data
		const transformedData = {
			id: data.buku_id,
			judul: data.judul,
			genre: data.genre,
			tahun_terbit: data.tahun_terbit,
			jumlah_halaman: data.jumlah_halaman,
			deskripsi: data.deskripsi,
			penerbit_id: data.penerbit_id,
			penerbit: data.nama_penerbit,
			penulis: data.penulis?.map((nama) => ({ nama_penulis: nama })) || [],
		};

		return NextResponse.json({
			success: true,
			data: transformedData,
		});
	} catch (error) {
		console.error('Error fetching book:', error);
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
			.from('Buku')
			.update(body)
			.eq('id', params.id)
			.select()
			.single();

		if (error) throw error;

		return NextResponse.json({
			success: true,
			data,
			message: 'Book updated successfully',
		});
	} catch (error) {
		console.error('Error updating book:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

export async function DELETE(request, { params }) {
	try {
		const { error } = await supabase.from('Buku').delete().eq('id', params.id);

		if (error) throw error;

		return NextResponse.json({
			success: true,
			message: 'Book deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting book:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
