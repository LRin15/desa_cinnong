<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Infografis;
use Revolution\Google\Sheets\Facades\Sheets;
use App\Models\Berita;
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

        return Inertia::render('Beranda', [
            'beritaTerbaru' => $beritaTerbaru,
        ]);
    }
    
    public function profilDesa()
    {

        return Inertia::render('ProfilDesa');
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