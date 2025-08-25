<?php

namespace App\Http\Controllers;

use App\Models\Infografis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class InfografisController extends Controller
{
    /**
     * Menampilkan halaman daftar infografis dengan pagination dan pencarian.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search');

        // Ambil data infografis dari database dengan fitur pencarian
        $infografisList = Infografis::when($search, function ($query, $search) {
                return $query->where('judul', 'like', '%' . $search . '%');
            })
            ->orderBy('tanggal_terbit', 'desc') // Urutkan dari yang terbaru
            ->paginate(5) // Ambil 5 item per halaman
            ->withQueryString() // Pertahankan parameter search di pagination
            ->through(fn ($infografis) => [
                'id' => $infografis->id,
                'judul' => $infografis->judul,
                'deskripsi' => $infografis->deskripsi,
                // Gunakan Storage::url() yang sama dengan dashboard admin
                'gambar' => $infografis->gambar ? Storage::url($infografis->gambar) : null,
                // Format tanggal menggunakan Carbon dari casting datetime
                'tanggal_terbit' => $infografis->tanggal_terbit->format('d F Y'),
            ]);

        return Inertia::render('InfografisDesa', [
            'infografisList' => $infografisList,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Menampilkan halaman detail untuk satu infografis.
     * Menggunakan route model binding dengan parameter id
     */
    public function show(int $id): Response
    {
        // Cari infografis berdasarkan ID
        // firstOrFail() akan otomatis menampilkan halaman 404 jika ID tidak ditemukan
        $infografis = Infografis::findOrFail($id);

        return Inertia::render('DetailInfografis', [
            'infografis' => [
                'id' => $infografis->id,
                'judul' => $infografis->judul,
                'deskripsi' => $infografis->deskripsi,
                // Konsisten menggunakan Storage::url()
                'gambar' => $infografis->gambar ? Storage::url($infografis->gambar) : null,
                'tanggal_terbit' => $infografis->tanggal_terbit->format('d F Y'),
            ],
        ]);
    }
}