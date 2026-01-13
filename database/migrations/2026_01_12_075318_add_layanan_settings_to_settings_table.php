<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Insert default layanan settings ke tabel settings
        $layananList = [
            // Layanan Kependudukan
            'layanan_ktp' => 'Surat Pengantar KTP',
            'layanan_kk' => 'Surat Pengantar KK',
            'layanan_domisili' => 'Surat Keterangan Domisili',
            'layanan_usaha' => 'Surat Keterangan Usaha',
            'layanan_sktm' => 'Surat Keterangan Tidak Mampu (SKTM)',
            'layanan_kelahiran' => 'Surat Keterangan Kelahiran',
            'layanan_kematian' => 'Surat Keterangan Kematian',
            
            // Layanan Umum
            'layanan_nikah' => 'Surat Pengantar Nikah',
            'layanan_pindah' => 'Surat Keterangan Pindah',
            'layanan_izin_kegiatan' => 'Surat Izin Kegiatan',
            'layanan_rekomendasi' => 'Surat Rekomendasi Desa',
        ];

        foreach ($layananList as $key => $name) {
            DB::table('settings')->insert([
                'key' => $key,
                'value' => json_encode([
                    'name' => $name,
                    'is_active' => true,
                    'category' => str_contains($key, 'nikah') || str_contains($key, 'pindah') || 
                                 str_contains($key, 'izin') || str_contains($key, 'rekomendasi') 
                                 ? 'umum' : 'kependudukan'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', [
            'layanan_ktp', 'layanan_kk', 'layanan_domisili', 'layanan_usaha',
            'layanan_sktm', 'layanan_kelahiran', 'layanan_kematian',
            'layanan_nikah', 'layanan_pindah', 'layanan_izin_kegiatan', 'layanan_rekomendasi'
        ])->delete();
    }
};