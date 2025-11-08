<?php

namespace App\Http\Controllers;

use App\Models\Infografis;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InfografisController extends Controller
{
    /**
     * Menampilkan halaman daftar infografis dengan pagination dan pencarian.
     */
    public function index(Request $request): Response
    {
        // Ambil nama desa dari settings
        $settings = Setting::pluck('value', 'key');
        
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
                'gambar' => $infografis->gambar ? asset('images/infografis/' . $infografis->gambar) : null,
                'tanggal_terbit' => $infografis->tanggal_terbit->format('d F Y'),
            ]);

        return Inertia::render('InfografisDesa', [
            'infografisList' => $infografisList,
            'filters' => [
                'search' => $search,
            ],
            'settings' => $settings,
        ]);
    }

    /**
     * Menampilkan halaman detail untuk satu infografis.
     * Menggunakan route model binding dengan parameter id
     */
    public function show(int $id): Response
    {
        // Ambil nama desa dari settings
        $settings = Setting::pluck('value', 'key');
        
        // Cari infografis berdasarkan ID
        $infografis = Infografis::findOrFail($id);

        return Inertia::render('DetailInfografis', [
            'infografis' => [
                'id' => $infografis->id,
                'judul' => $infografis->judul,
                'deskripsi' => $infografis->deskripsi,
                'gambar' => $infografis->gambar ? asset('images/infografis/' . $infografis->gambar) : null,
                'tanggal_terbit' => $infografis->tanggal_terbit->format('d F Y'),
            ],
            'settings' => $settings,
        ]);
    }
}