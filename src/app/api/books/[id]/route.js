import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
	try {
		const { data, error } = await supabase
			.from('Buku')
			.select(
				`
        *,
        Penerbit:penerbit_id(id, nama_penerbit, alamat_penerbit, no_telpon),
        Buku_Penulis(
          Penulis:penulis_id(id, nama_penulis, email)
        )
      `
			)
			.eq('id', params.id)
			.single();

		if (error) throw error;

		// Transform data to match the expected format
		const transformedData = {
			id: data.id,
			judul: data.judul,
			genre: data.genre,
			tahun_terbit: data.tahun_terbit,
			jumlah_halaman: data.jumlah_halaman,
			deskripsi: data.deskripsi,
			penerbit_id: data.penerbit_id,
			penerbit: data.Penerbit?.nama_penerbit || '',
			penulis:
				data.Buku_Penulis?.map((bp) => ({
					nama_penulis: bp.Penulis?.nama_penulis || '',
				})) || [],
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
