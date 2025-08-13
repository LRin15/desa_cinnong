<?php

// database/seeders/BeritaSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Berita;
use Illuminate\Support\Str;

class BeritaSeeder extends Seeder
{
    public function run(): void
    {
        $berita = [
            [
                'judul' => 'Update Data Kependudukan Kuartal III 2025',
                'kategori' => 'Pengumuman',
                'kutipan' => 'Data kependudukan Desa Cinnong telah diperbarui dengan total 1.868 jiwa tersebar di 4 dusun.',
                'isi' => 'Konten lengkap tentang update data kependudukan...',
                'gambar' => 'images/berita/default.jpg', // Simpan gambar di public/storage/images/berita/
                'tanggal_terbit' => now()->subDays(3),
            ],
            [
                'judul' => 'Program Bantuan UMKM Resmi Dibuka',
                'kategori' => 'Program Desa',
                'kutipan' => 'Pemerintah desa meluncurkan program bantuan modal usaha untuk UMKM terdaftar di Desa Cinnong.',
                'isi' => 'Konten lengkap tentang program bantuan UMKM...',
                'gambar' => 'images/berita/default.jpg',
                'tanggal_terbit' => now()->subDays(8),
            ],
             [
                'judul' => 'Gotong Royong Membersihkan Saluran Irigasi',
                'kategori' => 'Kegiatan Warga',
                'kutipan' => 'Warga Dusun I dan II melaksanakan kegiatan gotong royong untuk membersihkan saluran irigasi utama.',
                'isi' => 'Konten lengkap tentang kegiatan gotong royong...',
                'gambar' => 'images/berita/default.jpg',
                'tanggal_terbit' => now()->subDays(15),
            ],
        ];

        foreach ($berita as $item) {
            Berita::create([
                'judul' => $item['judul'],
                'slug' => Str::slug($item['judul']), // Membuat slug otomatis dari judul
                'kategori' => $item['kategori'],
                'kutipan' => $item['kutipan'],
                'isi' => $item['isi'],
                'gambar' => $item['gambar'],
                'tanggal_terbit' => $item['tanggal_terbit'],
            ]);
        }
    }
}