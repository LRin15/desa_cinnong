<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Infografis;
use Revolution\Google\Sheets\Facades\Sheets;

class PageController extends Controller
{
    public function beranda()
    {
        return Inertia::render('Beranda');
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