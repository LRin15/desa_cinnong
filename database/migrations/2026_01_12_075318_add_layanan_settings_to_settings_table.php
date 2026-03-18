<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Insert semua layanan settings ke tabel settings (termasuk pengaduan_aspirasi)
        $layananList = [
            // Layanan Kependudukan
            'layanan_ktp'      => ['name' => 'Surat Pengantar KTP',                  'category' => 'kependudukan'],
            'layanan_kk'       => ['name' => 'Surat Pengantar KK',                   'category' => 'kependudukan'],
            'layanan_domisili' => ['name' => 'Surat Keterangan Domisili',             'category' => 'kependudukan'],
            'layanan_usaha'    => ['name' => 'Surat Keterangan Usaha',               'category' => 'kependudukan'],
            'layanan_sktm'     => ['name' => 'Surat Keterangan Tidak Mampu (SKTM)',  'category' => 'kependudukan'],
            'layanan_kelahiran'=> ['name' => 'Surat Keterangan Kelahiran',            'category' => 'kependudukan'],
            'layanan_kematian' => ['name' => 'Surat Keterangan Kematian',             'category' => 'kependudukan'],

            // Layanan Umum
            'layanan_nikah'          => ['name' => 'Surat Pengantar Nikah',      'category' => 'umum'],
            'layanan_pindah'         => ['name' => 'Surat Keterangan Pindah',    'category' => 'umum'],
            'layanan_izin_kegiatan'  => ['name' => 'Surat Izin Kegiatan',        'category' => 'umum'],
            'layanan_rekomendasi'    => ['name' => 'Surat Rekomendasi Desa',     'category' => 'umum'],

            // Layanan Pengaduan & Aspirasi
            'layanan_pengaduan_aspirasi' => ['name' => 'Pengaduan & Aspirasi Masyarakat', 'category' => 'pengaduan'],
        ];

        foreach ($layananList as $key => $data) {
            // Gunakan updateOrInsert agar aman dijalankan berulang kali
            DB::table('settings')->updateOrInsert(
                ['key' => $key],
                [
                    'value' => json_encode([
                        'name'      => $data['name'],
                        'is_active' => true,
                        'category'  => $data['category'],
                    ]),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', [
            'layanan_ktp', 'layanan_kk', 'layanan_domisili', 'layanan_usaha',
            'layanan_sktm', 'layanan_kelahiran', 'layanan_kematian',
            'layanan_nikah', 'layanan_pindah', 'layanan_izin_kegiatan',
            'layanan_rekomendasi', 'layanan_pengaduan_aspirasi',
        ])->delete();
    }
};