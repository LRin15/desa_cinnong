<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\Infografis;
use App\Models\LayananSubmission;
use App\Models\Publikasi;
use App\Models\Setting;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_berita'     => Berita::count(),
            'total_infografis' => Infografis::count(),
            'total_publikasi'  => Publikasi::count(),
            'total_pengguna'   => User::where('role', User::ROLE_PENGGUNA_TERDAFTAR)->count(),
            'total_layanan'    => LayananSubmission::count(),
            'layanan_pending'  => LayananSubmission::where('status', 'pending')->count(),
            'layanan_diproses' => LayananSubmission::where('status', 'diproses')->count(),
            'layanan_selesai'  => LayananSubmission::where('status', 'selesai')->count(),
            'layanan_ditolak'  => LayananSubmission::where('status', 'ditolak')->count(),
        ];

        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Admin/Dashboard', [
            'stats'    => $stats,
            'settings' => $settings,
        ]);
    }
}