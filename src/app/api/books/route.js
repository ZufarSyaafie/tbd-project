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

		// Different query strategies based on filters
		let query;
		let countQuery;

		if (penulis) {
			// For penulis filter: use inner join to filter by author
			query = supabase
				.from('Buku')
				.select(
					`
					*,
					Penerbit:penerbit_id(id, nama_penerbit, alamat_penerbit, no_telpon),
					Buku_Penulis!inner(
						Penulis!inner(id, nama_penulis, email)
					)
				`
				)
				.ilike('Buku_Penulis.Penulis.nama_penulis', `%${penulis}%`);

			// Simplified count query using the same join structure
			countQuery = supabase
				.from('Buku')
				.select('*', { count: 'exact', head: true })
				.select(
					`
					Buku_Penulis!inner(
						Penulis!inner(nama_penulis)
					)
				`
				)
				.ilike('Buku_Penulis.Penulis.nama_penulis', `%${penulis}%`);
		} else if (penerbit) {
			// For penerbit filter: use inner join to filter by publisher
			query = supabase
				.from('Buku')
				.select(
					`
					*,
					Penerbit!inner(id, nama_penerbit, alamat_penerbit, no_telpon),
					Buku_Penulis(
						Penulis(id, nama_penulis, email)
					)
				`
				)
				.ilike('Penerbit.nama_penerbit', `%${penerbit}%`);

			// Simplified count query using the same join structure
			countQuery = supabase
				.from('Buku')
				.select('*', { count: 'exact', head: true })
				.select(
					`
					Penerbit!inner(nama_penerbit)
				`
				)
				.ilike('Penerbit.nama_penerbit', `%${penerbit}%`);
		} else {
			// Default query without special filters
			query = supabase.from('Buku').select(
				`
				*,
				Penerbit:penerbit_id(id, nama_penerbit, alamat_penerbit, no_telpon),
				Buku_Penulis(
					Penulis:penulis_id(id, nama_penulis, email)
				)
			`
			);

			// Count query for default
			countQuery = supabase
				.from('Buku')
				.select('id', { count: 'exact', head: true });
		}

		// Apply year filter if present (works for all query types)
		if (tahun) {
			const startDate = `${tahun}-01-01`;
			const endDate = `${tahun}-12-31`;
			query = query.gte('tahun_terbit', startDate).lte('tahun_terbit', endDate);
			countQuery = countQuery
				.gte('tahun_terbit', startDate)
				.lte('tahun_terbit', endDate);
		}

		// Execute queries
		const [{ data, error }, { count: totalCount, error: countError }] =
			await Promise.all([
				query
					.range(offset, offset + limit - 1)
					.order('id', { ascending: true }),
				countQuery,
			]);

		if (error) throw error;
		if (countError) throw countError;

		// Transform data to match the expected format
		const transformedData = (data || []).map((book) => {
			// Handle different response structures based on query type
			let penerbitData = book.Penerbit;
			let penulisData = book.Buku_Penulis;

			// Ensure consistent data structure
			if (Array.isArray(penerbitData)) {
				penerbitData = penerbitData[0];
			}

			return {
				id: book.id,
				judul: book.judul,
				genre: book.genre,
				tahun_terbit: book.tahun_terbit,
				jumlah_halaman: book.jumlah_halaman,
				deskripsi: book.deskripsi,
				penerbit_id: book.penerbit_id,
				penerbit: penerbitData?.nama_penerbit || 'Unknown',
				penulis: (penulisData || []).map((bp) => ({
					nama_penulis: bp.Penulis?.nama_penulis || 'Unknown',
				})),
			};
		});

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
