<?php

namespace App\Http\Controllers;

use App\Models\Infografis; // Pastikan model Infografis ada
use Illuminate\Http\Request;
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
                'gambar' => asset($infografis->gambar),
                // Format tanggal langsung dari backend
                'tanggal_terbit' => $infografis->tanggal_terbit->format('d F Y'),
            ]);

        return Inertia::render('InfografisDesa', [
            'infografisList' => $infografisList,
        ]);
    }

    /**
     * Menampilkan halaman detail untuk satu infografis.
     * (Untuk digunakan nanti saat halaman detail dibuat)
     */
    public function show(Infografis $infografis): Response
    {
        return Inertia::render('DetailInfografis', [
            'infografis' => $infografis,
        ]);
    }
}