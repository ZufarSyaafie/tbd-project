'use client';

// pages/test-supabase.js atau components/TestSupabase.js
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Sesuaikan path

export default function TestSupabase() {
	const [testResult, setTestResult] = useState('');
	const [loading, setLoading] = useState(false);

	const testConnection = async () => {
		setLoading(true);
		setTestResult('Testing...');

		try {
			// Test 1: Cek koneksi dasar
			console.log('Supabase URL:', supabase.supabaseUrl);
			console.log(
				'Supabase Key:',
				supabase.supabaseKey?.substring(0, 20) + '...'
			);

			// Test 2: Coba select data
			const { data, error } = await supabase
				.from('Penerbit')
				.select('*')
				.limit(5);

			if (error) {
				console.error('Supabase error:', error);
				setTestResult(`❌ Error: ${error.message}`);
				return;
			}

			console.log('Data dari Penerbit:', data);
			setTestResult(
				`✅ Koneksi berhasil! Data: ${JSON.stringify(data, null, 2)}`
			);

			// Test 3: Coba insert data
			const { data: insertData, error: insertError } = await supabase
				.from('Penerbit')
				.insert([{ nama_penerbit: 'Test Penerbit ' + Date.now() }])
				.select();

			if (insertError) {
				console.error('Insert error:', insertError);
				setTestResult(
					(prev) => prev + `\n❌ Insert Error: ${insertError.message}`
				);
			} else {
				console.log('Insert berhasil:', insertData);
				setTestResult(
					(prev) => prev + `\n✅ Insert berhasil: ${JSON.stringify(insertData)}`
				);
			}
		} catch (error) {
			console.error('General error:', error);
			setTestResult(`❌ General Error: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="rounded-lg bg-gray-800 p-6 text-white">
			<h2 className="mb-4 text-xl font-bold">Test Supabase Connection</h2>

			<button
				onClick={testConnection}
				disabled={loading}
				className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
			>
				{loading ? 'Testing...' : 'Test Connection'}
			</button>

			{testResult && (
				<pre className="mt-4 overflow-auto rounded bg-gray-900 p-4 text-sm">
					{testResult}
				</pre>
			)}
		</div>
	);
}
