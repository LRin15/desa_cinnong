<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RekapPenduduk; // Impor model Penduduk
use App\Models\Infografis;

class PageController extends Controller
{
    public function beranda()
    {
        return Inertia::render('Beranda');
    }

    public function profilDesa()
    {
        // Data profil bisa diambil dari database atau file config
        $profil = [
            'sejarah' => 'Desa Cinnong didirikan pada tahun...',
            'visi' => 'Menjadi desa yang mandiri, sejahtera, dan berbudaya.',
            'misi' => 'Meningkatkan kualitas sumber daya manusia...'
        ];
        return Inertia::render('ProfilDesa', ['profil' => $profil]);
    }

    public function dataDesa(Request $request)
    {
        $tahun = $request->input('tahun', 2025); // Ambil tahun dari request, default 2025
        
        $dataRekap = RekapPenduduk::where('tahun', $tahun)
            ->orderBy('bulan')
            ->orderBy('nama_dusun')
            ->get()
            ->groupBy(['nama_dusun', 'bulan']); // Kelompokkan data berdasarkan dusun, lalu bulan

        $dusunList = RekapPenduduk::where('tahun', $tahun)->distinct()->pluck('nama_dusun');

        $bulanList = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        return Inertia::render('DataDesa', [
            'dataRekap' => $dataRekap,
            'dusunList' => $dusunList,
            'bulanList' => $bulanList,
            'tahun' => (int)$tahun,
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