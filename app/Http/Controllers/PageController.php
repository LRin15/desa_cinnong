<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
// HAPUS: use App\Models\RekapPenduduk;
use App\Models\Infografis;
use Revolution\Google\Sheets\Facades\Sheets; // TAMBAHKAN INI

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
        // ===================================================================
        // MULAI LOGIKA BARU PENGAMBILAN DATA DARI GOOGLE SHEETS
        // ===================================================================

        $spreadsheetId = '1Ff5IO1ABom9kLrmjB6CiuzLX9Tw11jcpZYVtdGehCXA';
        $sheetName = 'LAPORAN DATA KEPENDUDUKAN';

        // Ambil semua data dari sheet
        $sheetData = Sheets::spreadsheet($spreadsheetId)->sheet($sheetName)->get();
        // dd($sheetData);
        // Header berada di baris pertama dari data yang diambil (index 0)
        $header = $sheetData->pull(0);

        // Inisialisasi variabel untuk dikirim ke frontend
        $dusunList = [];
        $bulanList = [];
        $dataRekap = [];
        $tahun = date('Y'); // Atau sesuaikan jika tahun dinamis

        // --- 1. Ekstrak Daftar Bulan ---
        foreach ($header as $key => $col) {
            if (!empty($col) && !in_array(strtoupper($col), ['NO.', 'DUSUN', 'L', 'P', 'J'])) {
                $bulanList[] = ucwords(strtolower($col));
            }
        }
        
        // --- 2. Proses Setiap Baris Data (Dusun) ---
        foreach ($sheetData as $row) {
            if (empty($row[1]) || strtoupper($row[1]) === 'JUMLAH') {
                continue;
            }
            
            $dusunNama = $row[1];
            $dusunList[] = $dusunNama;
            $dataRekap[$dusunNama] = [];

            foreach ($bulanList as $indexBulan => $namaBulan) {
                $colIndexL = ($indexBulan * 3) + 2;
                $colIndexP = $colIndexL + 1;

                $jumlahL = isset($row[$colIndexL]) && is_numeric($row[$colIndexL]) ? (int) $row[$colIndexL] : 0;
                $jumlahP = isset($row[$colIndexP]) && is_numeric($row[$colIndexP]) ? (int) $row[$colIndexP] : 0;

                $dataRekap[$dusunNama][$indexBulan + 1] = [
                    [
                        'jumlah_l' => $jumlahL,
                        'jumlah_p' => $jumlahP,
                    ]
                ];
            }
        }

        return Inertia::render('DataDesa', [
            'dataRekap' => $dataRekap,
            'dusunList' => $dusunList,
            'bulanList' => $bulanList,
            'tahun' => $tahun,
        ]);
        
        // ===================================================================
        // AKHIR LOGIKA BARU
        // ===================================================================
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