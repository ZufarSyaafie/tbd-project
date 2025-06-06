'use client';
// pages/test-supabase.js atau components/TestSupabase.js
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Sesuaikan path


export default function TestSupabase() {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState({
    connection: null,
    penerbit: null,
    buku: null,
    relasi: null
  });

  const testConnection = async () => {
    setLoading(true);
    setTestResult('🔄 Memulai testing...\n');
    setTests({ connection: null, penerbit: null, buku: null, relasi: null });

    try {
      // Test 1: Cek koneksi dasar
      setTestResult(prev => prev + '\n📡 Test 1: Cek koneksi dasar...\n');
      console.log('Supabase URL:', supabase.supabaseUrl);
      console.log('Supabase Key:', supabase.supabaseKey?.substring(0, 20) + '...');
      
      setTests(prev => ({ ...prev, connection: '✅' }));
      setTestResult(prev => prev + '✅ Koneksi dasar OK\n');

      // Test 2: Coba select data dari Penerbit
      setTestResult(prev => prev + '\n📚 Test 2: Select data Penerbit...\n');
      
      const { data: penerbitData, error: penerbitError } = await supabase
        .from('Penerbit')
        .select('*')
        .limit(5);

      if (penerbitError) {
        console.error('Penerbit error:', penerbitError);
        setTests(prev => ({ ...prev, penerbit: '❌' }));
        setTestResult(prev => prev + `❌ Error Penerbit: ${penerbitError.message}\n`);
      } else {
        console.log('Data dari Penerbit:', penerbitData);
        setTests(prev => ({ ...prev, penerbit: '✅' }));
        setTestResult(prev => prev + `✅ Penerbit OK (${penerbitData?.length || 0} records)\n`);
        setTestResult(prev => prev + `📋 Data: ${JSON.stringify(penerbitData, null, 2)}\n`);
      }

      // Test 3: Coba select data dari Buku
      setTestResult(prev => prev + '\n📖 Test 3: Select data Buku...\n');
      
      const { data: bukuData, error: bukuError } = await supabase
        .from('Buku')
        .select('*')
        .limit(3);

      if (bukuError) {
        console.error('Buku error:', bukuError);
        setTests(prev => ({ ...prev, buku: '❌' }));
        setTestResult(prev => prev + `❌ Error Buku: ${bukuError.message}\n`);
      } else {
        console.log('Data dari Buku:', bukuData);
        setTests(prev => ({ ...prev, buku: '✅' }));
        setTestResult(prev => prev + `✅ Buku OK (${bukuData?.length || 0} records)\n`);
        setTestResult(prev => prev + `📋 Sample data: ${JSON.stringify(bukuData?.[0] || {}, null, 2)}\n`);
      }

      // Test 4: Test relasi Buku dengan Penerbit
      setTestResult(prev => prev + '\n🔗 Test 4: Test relasi Buku-Penerbit...\n');
      
      const { data: relasiData, error: relasiError } = await supabase
        .from('Buku')
        .select(`
          id,
          judul,
          penerbit_id,
          Penerbit!inner (
            id,
            nama_penerbit
          )
        `)
        .limit(2);

      if (relasiError) {
        console.error('Relasi error:', relasiError);
        setTests(prev => ({ ...prev, relasi: '❌' }));
        setTestResult(prev => prev + `❌ Error Relasi: ${relasiError.message}\n`);
        
        // Try alternative query
        setTestResult(prev => prev + '\n🔄 Mencoba query alternatif...\n');
        const { data: altData, error: altError } = await supabase
          .from('Buku')
          .select(`
            id,
            judul,
            penerbit_id,
            penerbit:penerbit_id (
              id,
              nama_penerbit
            )
          `)
          .limit(2);
          
        if (altError) {
          setTestResult(prev => prev + `❌ Query alternatif juga gagal: ${altError.message}\n`);
        } else {
          setTests(prev => ({ ...prev, relasi: '⚠️' }));
          setTestResult(prev => prev + `⚠️ Query alternatif berhasil\n`);
          setTestResult(prev => prev + `📋 Data relasi: ${JSON.stringify(altData, null, 2)}\n`);
        }
      } else {
        console.log('Data relasi:', relasiData);
        setTests(prev => ({ ...prev, relasi: '✅' }));
        setTestResult(prev => prev + `✅ Relasi OK\n`);
        setTestResult(prev => prev + `📋 Data relasi: ${JSON.stringify(relasiData, null, 2)}\n`);
      }

      // Test 5: Test struktur tabel
      setTestResult(prev => prev + '\n🏗️ Test 5: Cek struktur tabel...\n');
      
      // Coba insert test data (akan di-rollback)
      const testPenerbitName = 'Test Penerbit ' + Date.now();
      const { data: insertData, error: insertError } = await supabase
        .from('Penerbit')
        .insert([{ nama_penerbit: testPenerbitName }])
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        setTestResult(prev => prev + `❌ Insert test gagal: ${insertError.message}\n`);
        setTestResult(prev => prev + `💡 Kemungkinan nama kolom salah. Cek apakah menggunakan 'nama' atau 'nama_penerbit'\n`);
      } else {
        console.log('Insert berhasil:', insertData);
        setTestResult(prev => prev + `✅ Insert test berhasil\n`);
        
        // Hapus data test
        if (insertData?.[0]?.id) {
          await supabase
            .from('Penerbit')
            .delete()
            .eq('id', insertData[0].id);
          setTestResult(prev => prev + `🗑️ Test data dihapus\n`);
        }
      }

    } catch (error) {
      console.error('General error:', error);
      setTestResult(prev => prev + `\n❌ General Error: ${error.message}\n`);
    } finally {
      setLoading(false);
      setTestResult(prev => prev + '\n🏁 Testing selesai!\n');
    }
  };

  const testSpecificQuery = async () => {
    setLoading(true);
    setTestResult('🔍 Test query spesifik untuk tabel buku...\n');

    try {
      // Test query yang digunakan di komponen utama
      const { data, error } = await supabase
        .from('Buku')
        .select(`
          id,
          judul,
          genre,
          tahun_terbit,
          jumlah_halaman,
          deskripsi,
          penerbit_id,
          Penerbit!inner (
            id,
            nama_penerbit
          ),
          Buku_Penulis (
            Penulis (
              nama_penulis
            )
          )
        `);

      if (error) {
        setTestResult(prev => prev + `❌ Query gagal: ${error.message}\n`);
        setTestResult(prev => prev + `💡 Detail error: ${JSON.stringify(error, null, 2)}\n`);
      } else {
        setTestResult(prev => prev + `✅ Query berhasil!\n`);
        setTestResult(prev => prev + `📊 Jumlah data: ${data?.length || 0}\n`);
        if (data && data.length > 0) {
          setTestResult(prev => prev + `📋 Sample data:\n${JSON.stringify(data[0], null, 2)}\n`);
        }
      }

    } catch (error) {
      setTestResult(prev => prev + `❌ Error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-gray-800 p-6 text-white max-w-4xl mx-auto">
      <h2 className="mb-4 text-xl font-bold">🧪 Test Supabase Connection</h2>
      
      {/* Status indicators */}
      <div className="mb-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span>Connection:</span>
          <span className="text-lg">{tests.connection || '⏳'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Penerbit:</span>
          <span className="text-lg">{tests.penerbit || '⏳'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Buku:</span>
          <span className="text-lg">{tests.buku || '⏳'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Relasi:</span>
          <span className="text-lg">{tests.relasi || '⏳'}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mb-4 flex gap-3">
        <button
          onClick={testConnection}
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '🔄 Testing...' : '🚀 Full Test'}
        </button>
        
        <button
          onClick={testSpecificQuery}
          disabled={loading}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '🔄 Testing...' : '🎯 Test Query Spesifik'}
        </button>
      </div>

      {/* Results */}
      {testResult && (
        <div className="mt-4">
          <h3 className="mb-2 font-semibold">📋 Hasil Test:</h3>
          <pre className="overflow-auto rounded bg-gray-900 p-4 text-sm max-h-96 whitespace-pre-wrap">
            {testResult}
          </pre>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 rounded bg-blue-900/30 p-4 text-sm">
        <h3 className="mb-2 font-semibold">📝 Instruksi:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Pastikan file <code>@/lib/supabase</code> sudah dikonfigurasi dengan benar</li>
          <li>Ganti mock supabase client dengan import yang sebenarnya</li>
          <li>Jalankan "Full Test" untuk mengecek semua aspek</li>
          <li>Jalankan "Test Query Spesifik" untuk mengecek query yang digunakan di tabel</li>
          <li>Perhatikan hasil di console browser untuk detail lebih lanjut</li>
        </ol>
      </div>
    </div>
  );
}