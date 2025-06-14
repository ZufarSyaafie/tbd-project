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

		// Build the base query with joins
		let query = supabase.from('Buku').select(
			`
        *,
        Penerbit:penerbit_id(id, nama_penerbit, alamat_penerbit, no_telpon),
        Buku_Penulis(
          Penulis:penulis_id(id, nama_penulis, email)
        )
      `,
			{ count: 'exact' }
		);

		// Apply filters
		if (penerbit) {
			query = query.eq('Penerbit.nama_penerbit', penerbit);
		}
		if (tahun) {
			// Extract year from date field
			const startDate = `${tahun}-01-01`;
			const endDate = `${tahun}-12-31`;
			query = query.gte('tahun_terbit', startDate).lte('tahun_terbit', endDate);
		}
		if (penulis) {
			query = query.eq('Buku_Penulis.Penulis.nama_penulis', penulis);
		}

		const {
			data,
			error,
			count: totalCount,
		} = await query
			.range(offset, offset + limit - 1)
			.order('id', { ascending: true });

		if (error) throw error;

		// Transform data to match the expected format
		const transformedData = (data || []).map((book) => ({
			id: book.id,
			judul: book.judul,
			genre: book.genre,
			tahun_terbit: book.tahun_terbit,
			jumlah_halaman: book.jumlah_halaman,
			deskripsi: book.deskripsi,
			penerbit_id: book.penerbit_id,
			penerbit: book.Penerbit?.nama_penerbit || '',
			penulis:
				book.Buku_Penulis?.map((bp) => ({
					nama_penulis: bp.Penulis?.nama_penulis || '',
				})) || [],
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
