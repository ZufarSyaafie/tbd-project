import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const type = searchParams.get('type');
		const query = searchParams.get('query') || '';

		let suggestions = [];

		switch (type) {
			case 'penulis':
				const { data: penulisData, error: penulisError } = await supabase
					.from('Penulis')
					.select('nama_penulis')
					.ilike('nama_penulis', `%${query}%`)
					.limit(10);

				if (penulisError) throw penulisError;

				suggestions = penulisData?.map((p) => p.nama_penulis) || [];
				break;

			case 'penerbit':
				const { data: penerbitData, error: penerbitError } = await supabase
					.from('Penerbit')
					.select('nama_penerbit')
					.ilike('nama_penerbit', `%${query}%`)
					.limit(10);

				if (penerbitError) throw penerbitError;
				suggestions = penerbitData?.map((p) => p.nama_penerbit) || [];
				break;

			case 'tahun':
				const { data: tahunData, error: tahunError } = await supabase
					.from('Buku')
					.select('tahun_terbit')
					.not('tahun_terbit', 'is', null)
					.order('tahun_terbit', { ascending: false });

				if (tahunError) throw tahunError;

				// Extract unique years from dates
				const years = [
					...new Set(
						tahunData?.map((book) => {
							const date = new Date(book.tahun_terbit);
							return date.getFullYear().toString();
						}) || []
					),
				]
					.filter((year) => year.includes(query))
					.slice(0, 10);

				suggestions = years;
				break;

			default:
				suggestions = [];
		}

		return NextResponse.json({
			success: true,
			data: suggestions,
		});
	} catch (error) {
		console.error('Error getting suggestions:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
