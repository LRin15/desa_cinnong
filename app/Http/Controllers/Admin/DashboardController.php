<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\Infografis;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Publikasi;

class DashboardController extends Controller
{
    /**
     * Menampilkan halaman dasbor utama.
     */
    public function index()
    {
        // Mengambil data statistik untuk ditampilkan di dasbor
        $stats = [
            'total_berita' => Berita::count(),
            'total_infografis' => Infografis::count(),
            'total_publikasi' => Publikasi::count(),
            'total_pengguna' => User::count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }
}