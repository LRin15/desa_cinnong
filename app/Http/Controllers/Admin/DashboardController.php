<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\Infografis;
use App\Models\Publikasi;
use App\Models\User;
use App\Models\Pengaduan;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_berita' => Berita::count(),
            'total_infografis' => Infografis::count(),
            'total_publikasi' => Publikasi::count(),
            'total_pengguna' => User::count(),
            'total_pengaduan' => Pengaduan::count(),
            'pengaduan_belum_diproses' => Pengaduan::where('status', 'belum_diproses')->count(),
            'pengaduan_sedang_diproses' => Pengaduan::where('status', 'sedang_diproses')->count(),
            'pengaduan_selesai' => Pengaduan::where('status', 'selesai')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }
}