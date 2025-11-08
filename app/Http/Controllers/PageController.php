<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Infografis;
use Revolution\Google\Sheets\Facades\Sheets;
use App\Models\Berita;
use App\Models\Setting;
use Illuminate\Support\Str;

class PageController extends Controller
{
    public function beranda()
    {
        $beritaTerbaru = Berita::latest('tanggal_terbit')
            ->take(3)
            ->get()
            ->map(fn ($berita) => [
                'judul' => $berita->judul,
                'slug' => $berita->slug,
                'kategori' => $berita->kategori,
                'tanggal_terbit' => $berita->tanggal_terbit->format('d F Y'),
                'kutipan' => Str::limit($berita->kutipan, 100),
                'gambar' => $berita->gambar ? asset('images/berita/' . $berita->gambar) : null,
            ]);

        // Ambil data settings untuk statistik dan nama desa
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Beranda', [
            'beritaTerbaru' => $beritaTerbaru,
            'settings' => $settings,
        ]);
    }
    
    public function profilDesa()
    {
        // Ambil data settings untuk profil desa
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('ProfilDesa', [
            'settings' => $settings,
        ]);
    }

    public function infografisDesa()
    {
        // Ambil semua data infografis, urutkan dari yang terbaru
        $semuaInfografis = Infografis::latest('tanggal_terbit')->get();

        return Inertia::render('InfografisDesa', [
            'infografisList' => $semuaInfografis,
        ]);
    }
}