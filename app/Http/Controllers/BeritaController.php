<?php

// app/Http/Controllers/BeritaController.php
namespace App\Http\Controllers;

use App\Models\Berita;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BeritaController extends Controller
{
    /**
     * Menampilkan halaman daftar berita dengan fitur pencarian.
     */
    public function index(Request $request): Response
    {
        // Ambil nama desa dari settings
        $settings = Setting::pluck('value', 'key');
        
        $search = $request->get('search');

        $beritaList = Berita::when($search, function ($query, $search) {
                return $query->where('judul', 'like', '%' . $search . '%');
            })
            ->latest('tanggal_terbit') // Ambil data terbaru dulu
            ->paginate(6) // Ambil 6 berita per halaman
            ->withQueryString() // Pertahankan parameter search di pagination
            ->through(fn ($berita) => [
                'id' => $berita->id,
                'judul' => $berita->judul,
                'slug' => $berita->slug,
                'kategori' => $berita->kategori,
                'kutipan' => $berita->kutipan,
                'gambar' => $berita->gambar ? asset('images/berita/' . $berita->gambar) : null,
                'tanggal_terbit' => $berita->tanggal_terbit->format('d F Y'),
            ]);

        return Inertia::render('Berita', [
            'beritaList' => $beritaList,
            'filters' => [
                'search' => $search,
            ],
            'settings' => $settings,
        ]);
    }

    /**
     * Menampilkan halaman detail berita berdasarkan slug.
     */
    public function show(string $slug): Response
    {
        // Ambil nama desa dari settings
        $settings = Setting::pluck('value', 'key');
        
        // Cari satu berita berdasarkan slug-nya.
        $berita = Berita::where('slug', $slug)->firstOrFail();

        return Inertia::render('DetailBerita', [
            'berita' => [
                'id' => $berita->id,
                'judul' => $berita->judul,
                'slug' => $berita->slug,
                'kategori' => $berita->kategori,
                'isi' => $berita->isi,
                'kutipan' => $berita->kutipan,
                'gambar' => $berita->gambar ? asset('images/berita/' . $berita->gambar) : null,
                'tanggal_terbit' => $berita->tanggal_terbit->format('d F Y'),
            ],
            'settings' => $settings,
        ]);
    }
}