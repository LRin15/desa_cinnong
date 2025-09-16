<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Publikasi;
use Carbon\Carbon;

class PublikasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $publikasi = [
            [
                'judul' => 'Laporan Keuangan Desa Tahun 2024',
                'deskripsi' => 'Laporan lengkap keuangan dan anggaran Desa Cinnong untuk tahun anggaran 2024, termasuk realisasi APBDes dan pertanggungjawaban keuangan.',
                'tanggal_publikasi' => Carbon::parse('2025-01-15'),
                'nama_file' => 'laporan_keuangan_2024.pdf',
                'nama_asli_file' => 'Laporan Keuangan Desa Cinnong 2024.pdf',
                'tipe_file' => 'pdf',
                'ukuran_file' => 2560000, // 2.5 MB dalam bytes
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Data Kependudukan dan Statistik Desa 2024',
                'deskripsi' => 'Data lengkap kependudukan Desa Cinnong tahun 2024, termasuk demografi, tingkat pendidikan, dan mata pencaharian penduduk.',
                'tanggal_publikasi' => Carbon::parse('2025-01-10'),
                'nama_file' => 'data_penduduk_2024.xlsx',
                'nama_asli_file' => 'Data Kependudukan Desa Cinnong 2024.xlsx',
                'tipe_file' => 'xlsx',
                'ukuran_file' => 1843200, // 1.8 MB dalam bytes
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Peraturan Desa Nomor 1 Tahun 2024',
                'deskripsi' => 'Peraturan Desa tentang Tata Tertib Keamanan dan Ketertiban Lingkungan di Wilayah Desa Cinnong.',
                'tanggal_publikasi' => Carbon::parse('2025-01-05'),
                'nama_file' => 'perdes_01_2024.docx',
                'nama_asli_file' => 'Peraturan Desa No 1 Tahun 2024.docx',
                'tipe_file' => 'docx',
                'ukuran_file' => 870400, // 850 KB dalam bytes
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Rencana Pembangunan Jangka Menengah Desa 2024-2030',
                'deskripsi' => 'Dokumen perencanaan pembangunan jangka menengah Desa Cinnong periode 2024-2030 yang memuat visi, misi, dan program prioritas.',
                'tanggal_publikasi' => Carbon::parse('2024-12-28'),
                'nama_file' => 'rpjm_desa_2024_2030.pdf',
                'nama_asli_file' => 'RPJM Desa Cinnong 2024-2030.pdf',
                'tipe_file' => 'pdf',
                'ukuran_file' => 4194304, // 4 MB dalam bytes
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Profil Potensi Ekonomi Desa 2024',
                'deskripsi' => 'Dokumen yang berisi informasi lengkap tentang potensi ekonomi, UMKM, dan peluang investasi di Desa Cinnong.',
                'tanggal_publikasi' => Carbon::parse('2024-12-20'),
                'nama_file' => 'profil_ekonomi_desa_2024.pdf',
                'nama_asli_file' => 'Profil Potensi Ekonomi Desa Cinnong 2024.pdf',
                'tipe_file' => 'pdf',
                'ukuran_file' => 3145728, // 3 MB dalam bytes
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($publikasi as $item) {
            Publikasi::create($item);
        }
    }
}