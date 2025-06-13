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
					.from('buku_detail_view')
					.select('penulis')
					.not('penulis', 'is', null);

				if (penulisError) throw penulisError;

				const allAuthors =
					penulisData?.flatMap((book) => book.penulis || []) || [];
				const uniqueAuthors = [...new Set(allAuthors)]
					.filter((author) =>
						author.toLowerCase().includes(query.toLowerCase())
					)
					.slice(0, 10);

				suggestions = uniqueAuthors;
				break;

			case 'penerbit':
				const { data: penerbitData, error: penerbitError } = await supabase
					.from('buku_detail_view')
					.select('nama_penerbit')
					.ilike('nama_penerbit', `%${query}%`)
					.limit(10);

				if (penerbitError) throw penerbitError;
				suggestions = [
					...new Set(penerbitData?.map((p) => p.nama_penerbit) || []),
				];
				break;

			case 'tahun':
				const { data: tahunData, error: tahunError } = await supabase
					.from('buku_detail_view')
					.select('tahun')
					.not('tahun', 'is', null)
					.order('tahun', { ascending: false });

				if (tahunError) throw tahunError;

				const years = [
					...new Set(tahunData?.map((book) => book.tahun.toString()) || []),
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
