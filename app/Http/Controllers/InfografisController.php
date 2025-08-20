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
     * Menampilkan halaman daftar infografis dengan pagination.
     */
    public function index(): Response
    {
        // Ambil data infografis dari database
        $infografisList = Infografis::latest('tanggal_terbit') // Urutkan dari yang terbaru
            ->paginate(5) // Ambil 5 item per halaman
            ->through(fn ($infografis) => [
                'id' => $infografis->id,
                'judul' => $infografis->judul,
                'deskripsi' => $infografis->deskripsi,
                // Gunakan Storage::url() yang sama dengan dashboard admin
                'gambar' => $infografis->gambar ? Storage::url($infografis->gambar) : null,
                // Format tanggal langsung dari backend
                'tanggal_terbit' => $infografis->tanggal_terbit->format('d F Y'),
            ]);

        return Inertia::render('InfografisDesa', [
            'infografisList' => $infografisList,
        ]);
    }

    /**
     * Menampilkan halaman detail untuk satu infografis.
     */
    public function show(Infografis $infografis): Response
    {
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