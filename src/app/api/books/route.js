import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page')) || 1;
		const limit = parseInt(searchParams.get('limit')) || 25;
		const penerbit = searchParams.get('penerbit');
		const tahun = searchParams.get('tahun');
		const penulis = searchParams.get('penulis');

		const offset = (page - 1) * limit;

		let query = supabase
			.from('buku_detail_view')
			.select('*', { count: 'exact' });

		// Apply filters
		if (penerbit) {
			query = query.eq('nama_penerbit', penerbit);
		}
		if (tahun) {
			query = query.eq('tahun', parseInt(tahun));
		}
		if (penulis) {
			query = query.contains('penulis', [penulis]);
		}

		const {
			data,
			error,
			count: totalCount,
		} = await query
			.range(offset, offset + limit - 1)
			.order('buku_id', { ascending: true });

		if (error) throw error;

		// Transform data
		const transformedData = (data || []).map((book) => ({
			id: book.buku_id,
			judul: book.judul,
			genre: book.genre,
			tahun_terbit: book.tahun_terbit,
			jumlah_halaman: book.jumlah_halaman,
			deskripsi: book.deskripsi,
			penerbit_id: book.penerbit_id,
			penerbit: book.nama_penerbit,
			penulis: book.penulis?.map((nama) => ({ nama_penulis: nama })) || [],
		}));

		return NextResponse.json({
			success: true,
			data: transformedData,
			totalItems: totalCount || 0,
			totalPages: Math.ceil((totalCount || 0) / limit),
			currentPage: page,
		});
	} catch (error) {
		console.error('Error fetching books:', error);
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
			.from('Buku')
			.insert([body])
			.select()
			.single();

		if (error) throw error;

		return NextResponse.json({
			success: true,
			data,
			message: 'Book created successfully',
		});
	} catch (error) {
		console.error('Error creating book:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
