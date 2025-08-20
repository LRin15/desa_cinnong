<?php

// app/Http/Controllers/BeritaController.php
namespace App\Http\Controllers;

use App\Models\Berita;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BeritaController extends Controller
{
    /**
     * Menampilkan halaman daftar berita.
     */
    public function index(): Response
    {
        $beritaList = Berita::latest('tanggal_terbit') // Ambil data terbaru dulu
            ->paginate(6) // Ambil 6 berita per halaman
            ->through(fn ($berita) => [
                'id' => $berita->id,
                'judul' => $berita->judul,
                'slug' => $berita->slug,
                'kategori' => $berita->kategori,
                'kutipan' => $berita->kutipan,
                // Gunakan Storage::url() yang konsisten dengan dashboard admin
                'gambar' => $berita->gambar ? Storage::url($berita->gambar) : null,
                'tanggal_terbit' => $berita->tanggal_terbit->format('d F Y'), // Format tanggal di backend
            ]);

        return Inertia::render('Berita', [
            'beritaList' => $beritaList,
        ]);
    }

    /**
     * Menampilkan halaman detail berita berdasarkan slug.
     */
    public function show(string $slug): Response
    {
        // Cari satu berita berdasarkan slug-nya.
        // firstOrFail() akan otomatis menampilkan halaman 404 jika slug tidak ditemukan.
        $berita = Berita::where('slug', $slug)->firstOrFail();

        return Inertia::render('DetailBerita', [
            'berita' => [
                'id' => $berita->id,
                'judul' => $berita->judul,
                'slug' => $berita->slug,
                'kategori' => $berita->kategori,
                'isi' => $berita->isi, // Kirim konten lengkapnya
                'kutipan' => $berita->kutipan,
                // Konsisten menggunakan Storage::url()
                'gambar' => $berita->gambar ? Storage::url($berita->gambar) : null,
                'tanggal_terbit' => $berita->tanggal_terbit->format('d F Y'),
            ],
        ]);
    }
}