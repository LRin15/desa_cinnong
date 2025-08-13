<?php

// app/Http/Controllers/BeritaController.php
namespace App\Http\Controllers;

use App\Models\Berita;
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
                // Pastikan path gambar benar untuk diakses dari frontend
                'gambar' => asset($berita->gambar),
                'tanggal_terbit' => $berita->tanggal_terbit->format('d F Y'), // Format tanggal di backend
            ]);

        return Inertia::render('Berita', [
            'beritaList' => $beritaList,
        ]);
    }

    public function show(string $slug)
    {
        // Cari satu berita berdasarkan slug-nya.
        // firstOrFail() akan otomatis menampilkan halaman 404 jika slug tidak ditemukan.
        $berita = Berita::where('slug', $slug)->firstOrFail();

        return Inertia::render('DetailBerita', [
            'berita' => [
                'id' => $berita->id,
                'judul' => $berita->judul,
                'kategori' => $berita->kategori,
                'isi' => $berita->isi, // Kirim konten lengkapnya
                'gambar' => asset($berita->gambar),
                'tanggal_terbit' => $berita->tanggal_terbit->format('d F Y'),
            ],
        ]);
    }
}