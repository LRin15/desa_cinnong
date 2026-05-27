<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $layananList = [
            // Layanan Kependudukan
            ['name' => 'Surat Pengantar KTP',                 'category' => 'kependudukan'],
            ['name' => 'Surat Pengantar KK',                  'category' => 'kependudukan'],
            ['name' => 'Surat Keterangan Domisili',           'category' => 'kependudukan'],
            ['name' => 'Surat Keterangan Usaha',              'category' => 'kependudukan'],
            ['name' => 'Surat Keterangan Tidak Mampu (SKTM)', 'category' => 'kependudukan'],
            ['name' => 'Surat Keterangan Kelahiran',          'category' => 'kependudukan'],
            ['name' => 'Surat Keterangan Kematian',           'category' => 'kependudukan'],

            // Layanan Umum
            ['name' => 'Surat Pengantar Nikah',   'category' => 'umum'],
            ['name' => 'Surat Keterangan Pindah', 'category' => 'umum'],
            ['name' => 'Surat Izin Kegiatan',     'category' => 'umum'],
            ['name' => 'Surat Rekomendasi Desa',  'category' => 'umum'],

            // Layanan Pengaduan & Aspirasi
            ['name' => 'Pengaduan & Aspirasi Masyarakat', 'category' => 'pengaduan'],
        ];

        foreach ($layananList as $data) {
            DB::table('layanan_settings')->updateOrInsert(
                ['name' => $data['name'], 'category' => $data['category']],
                [
                    'is_active'  => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        // Hapus data layanan lama dari tabel settings jika ada
        DB::table('settings')->where('key', 'LIKE', 'layanan_%')->delete();
    }

    public function down(): void
    {
        DB::table('layanan_settings')->truncate();

        // Kembalikan data ke tabel settings (rollback)
        $layananList = [
            'layanan_ktp'               => ['name' => 'Surat Pengantar KTP',                 'category' => 'kependudukan'],
            'layanan_kk'                => ['name' => 'Surat Pengantar KK',                  'category' => 'kependudukan'],
            'layanan_domisili'          => ['name' => 'Surat Keterangan Domisili',           'category' => 'kependudukan'],
            'layanan_usaha'             => ['name' => 'Surat Keterangan Usaha',              'category' => 'kependudukan'],
            'layanan_sktm'              => ['name' => 'Surat Keterangan Tidak Mampu (SKTM)', 'category' => 'kependudukan'],
            'layanan_kelahiran'         => ['name' => 'Surat Keterangan Kelahiran',          'category' => 'kependudukan'],
            'layanan_kematian'          => ['name' => 'Surat Keterangan Kematian',           'category' => 'kependudukan'],
            'layanan_nikah'             => ['name' => 'Surat Pengantar Nikah',               'category' => 'umum'],
            'layanan_pindah'            => ['name' => 'Surat Keterangan Pindah',             'category' => 'umum'],
            'layanan_izin_kegiatan'     => ['name' => 'Surat Izin Kegiatan',                 'category' => 'umum'],
            'layanan_rekomendasi'       => ['name' => 'Surat Rekomendasi Desa',              'category' => 'umum'],
            'layanan_pengaduan_aspirasi'=> ['name' => 'Pengaduan & Aspirasi Masyarakat',     'category' => 'pengaduan'],
        ];

        foreach ($layananList as $key => $data) {
            DB::table('settings')->updateOrInsert(
                ['key' => $key],
                [
                    'value'      => json_encode(['name' => $data['name'], 'is_active' => true, 'category' => $data['category']]),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
};